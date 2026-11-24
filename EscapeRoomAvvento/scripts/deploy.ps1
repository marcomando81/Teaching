[CmdletBinding()]
param(
    [switch]$SkipBuild,
    [string]$EnvFile = "",
    [string]$TargetPath = "",
    [string]$UploadUrl = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
if ([string]::IsNullOrWhiteSpace($EnvFile)) {
    $EnvFile = Join-Path $ProjectRoot ".env"
}

function Read-DotEnv {
    param([string]$Path)
    $values = @{}
    if (-not (Test-Path -LiteralPath $Path)) {
        return $values
    }
    foreach ($line in Get-Content -LiteralPath $Path -Encoding UTF8) {
        $trimmed = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($trimmed) -or $trimmed.StartsWith("#")) {
            continue
        }
        $sepIndex = $trimmed.IndexOf("=")
        if ($sepIndex -lt 1) {
            continue
        }
        $key = $trimmed.Substring(0, $sepIndex).Trim()
        $val = $trimmed.Substring($sepIndex + 1).Trim()
        if (($val.StartsWith('"') -and $val.EndsWith('"')) -or ($val.StartsWith("'") -and $val.EndsWith("'"))) {
            if ($val.Length -ge 2) {
                $val = $val.Substring(1, $val.Length - 2)
            }
        }
        $values[$key] = $val
    }
    return $values
}

# 1. Load configuration from .env
$envVars = Read-DotEnv -Path $EnvFile

$apiKey = if ($envVars.ContainsKey("DEWAY_API_KEY")) { $envVars["DEWAY_API_KEY"] } else { $env:DEWAY_API_KEY }
if ([string]::IsNullOrWhiteSpace($apiKey)) {
    throw "DEWAY_API_KEY mancante. Impostala in '$EnvFile' oppure come variabile d'ambiente."
}

if ([string]::IsNullOrWhiteSpace($UploadUrl)) {
    $UploadUrl = if ($envVars.ContainsKey("DEWAY_UPLOAD_URL") -and -not [string]::IsNullOrWhiteSpace($envVars["DEWAY_UPLOAD_URL"])) {
        $envVars["DEWAY_UPLOAD_URL"]
    } else {
        "https://deway.it/main/api/Files/Upload"
    }
}

if ([string]::IsNullOrWhiteSpace($TargetPath)) {
    $TargetPath = if ($envVars.ContainsKey("DEWAY_DEPLOY_PATH") -and -not [string]::IsNullOrWhiteSpace($envVars["DEWAY_DEPLOY_PATH"])) {
        $envVars["DEWAY_DEPLOY_PATH"]
    } else {
        "scuola/escaperoom"
    }
}

# 2. Build (unless -SkipBuild)
if (-not $SkipBuild) {
    Write-Host "==> Esecuzione build (npm run build)..." -ForegroundColor Cyan
    Push-Location $ProjectRoot
    try {
        & npm run build
        if ($LASTEXITCODE -ne 0) {
            throw "Build fallita con exit code $LASTEXITCODE."
        }
    } finally {
        Pop-Location
    }
} else {
    Write-Host "==> Build saltata (-SkipBuild)." -ForegroundColor Yellow
}

$distDir = Join-Path $ProjectRoot "dist"
if (-not (Test-Path -LiteralPath $distDir -PathType Container)) {
    throw "Cartella dist non trovata in '$distDir'."
}

$distFiles = @(Get-ChildItem -LiteralPath $distDir -Recurse -File)
if ($distFiles.Count -eq 0) {
    throw "La cartella '$distDir' è vuota."
}

# 3. Create cross-platform ZIP (forward slashes in entry names for Linux servers)
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.Net.Http

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipFileName = "dist-$timestamp.zip"
$zipPath = Join-Path ([System.IO.Path]::GetTempPath()) $zipFileName

Write-Host "==> Creazione archivio ZIP ($($distFiles.Count) file)..." -ForegroundColor Cyan

try {
    if (Test-Path -LiteralPath $zipPath) {
        Remove-Item -LiteralPath $zipPath -Force
    }

    $zipStream = [System.IO.File]::Open($zipPath, [System.IO.FileMode]::Create)
    try {
        $archive = New-Object System.IO.Compression.ZipArchive($zipStream, [System.IO.Compression.ZipArchiveMode]::Create, $false)
        try {
            $distRootNormalized = $distDir.TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar
            foreach ($file in $distFiles) {
                $relativePath = $file.FullName.Substring($distRootNormalized.Length).Replace('\', '/')
                [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                    $archive,
                    $file.FullName,
                    $relativePath,
                    [System.IO.Compression.CompressionLevel]::Optimal
                ) | Out-Null
            }
        } finally {
            $archive.Dispose()
        }
    } finally {
        $zipStream.Dispose()
    }

    $zipSizeKb = [Math]::Round((Get-Item -LiteralPath $zipPath).Length / 1KB, 1)
    Write-Host "==> Upload di '$zipFileName' ($zipSizeKb KB) verso $UploadUrl (Path: $TargetPath)..." -ForegroundColor Cyan

    # 4. Upload via multipart/form-data
    $httpClient = New-Object System.Net.Http.HttpClient
    $httpClient.Timeout = [TimeSpan]::FromMinutes(5)
    $httpClient.DefaultRequestHeaders.Authorization = New-Object System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", $apiKey)

    try {
        $form = New-Object System.Net.Http.MultipartFormDataContent
        $fileStream = [System.IO.File]::OpenRead($zipPath)
        try {
            $fileContent = New-Object System.Net.Http.StreamContent($fileStream)
            $fileContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("application/zip")
            $form.Add($fileContent, "File", $zipFileName)
            $form.Add((New-Object System.Net.Http.StringContent($TargetPath)), "Path")
            $form.Add((New-Object System.Net.Http.StringContent("true")), "IsZip")

            $response = $httpClient.PostAsync($UploadUrl, $form).GetAwaiter().GetResult()
            $body = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()

            if (-not $response.IsSuccessStatusCode) {
                $statusCode = [int]$response.StatusCode
                throw "Upload fallito (HTTP $statusCode $($response.ReasonPhrase)): $body"
            }

            Write-Host "==> Deploy completato con successo!" -ForegroundColor Green
            try {
                $json = $body | ConvertFrom-Json
                Write-Host "    TargetPath         : $($json.TargetPath)"
                Write-Host "    FilesWritten       : $($json.FilesWritten)"
                Write-Host "    DirectoriesCreated : $($json.DirectoriesCreated)"
                Write-Host "    TotalBytesWritten  : $($json.TotalBytesWritten)"
                Write-Host "    DurationMs         : $($json.DurationMs) ms"
                if ($json.Message) {
                    Write-Host "    Message            : $($json.Message)"
                }
            } catch {
                Write-Host $body
            }
        } finally {
            $fileStream.Dispose()
            $form.Dispose()
        }
    } finally {
        $httpClient.Dispose()
    }
} finally {
    if (Test-Path -LiteralPath $zipPath) {
        Remove-Item -LiteralPath $zipPath -Force -ErrorAction SilentlyContinue
    }
}

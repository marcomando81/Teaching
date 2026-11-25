$ErrorActionPreference = 'Stop'

$root = [System.IO.Path]::GetFullPath($PSScriptRoot)
$basePath = '/apps/scuola/escaperoom'

$mimeTypes = @{
  '.html'        = 'text/html; charset=utf-8'
  '.js'          = 'application/javascript; charset=utf-8'
  '.mjs'         = 'application/javascript; charset=utf-8'
  '.css'         = 'text/css; charset=utf-8'
  '.json'        = 'application/json; charset=utf-8'
  '.webmanifest' = 'application/manifest+json; charset=utf-8'
  '.webp'        = 'image/webp'
  '.png'         = 'image/png'
  '.jpg'         = 'image/jpeg'
  '.jpeg'        = 'image/jpeg'
  '.svg'         = 'image/svg+xml'
  '.ico'         = 'image/x-icon'
  '.woff'        = 'font/woff'
  '.woff2'       = 'font/woff2'
  '.ttf'         = 'font/ttf'
}

$listener = $null
$port = $null

for ($candidate = 8080; $candidate -le 8099; $candidate++) {
  $tryListener = New-Object System.Net.HttpListener
  $tryListener.Prefixes.Add("http://localhost:$candidate/")
  try {
    $tryListener.Start()
    $listener = $tryListener
    $port = $candidate
    break
  } catch {
    $tryListener.Close()
  }
}

if (-not $listener) {
  Write-Host 'Impossibile avviare il server sulle porte 8080-8099.' -ForegroundColor Red
  Read-Host 'Premi Invio per chiudere'
  exit 1
}

$appUrl = "http://localhost:$port$basePath/"

Write-Host ''
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "  Il Caso dell'Orologio Fermo - Server Locale Offline" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host ''
Write-Host "  Indirizzo: $appUrl" -ForegroundColor Green
Write-Host '  Lascia questa finestra aperta mentre giochi.' -ForegroundColor Cyan
Write-Host '  Chiudi questa finestra (o premi Ctrl+C) per fermare il server.' -ForegroundColor Cyan
Write-Host ''

Start-Process $appUrl

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    try {
      $rawPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)

      if ($rawPath -eq '/' -or $rawPath -eq $basePath) {
        $response.StatusCode = 302
        $response.RedirectLocation = "$basePath/"
        $response.Close()
        continue
      }

      if ($rawPath.StartsWith("$basePath/")) {
        $relPath = $rawPath.Substring($basePath.Length + 1)
      } else {
        $relPath = $rawPath.TrimStart('/')
      }

      if ([string]::IsNullOrWhiteSpace($relPath)) {
        $relPath = 'index.html'
      }

      $candidatePath = [System.IO.Path]::GetFullPath((Join-Path $root $relPath))
      $isInsideRoot = $candidatePath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)

      if (-not $isInsideRoot -or -not (Test-Path -LiteralPath $candidatePath -PathType Leaf)) {
        if (-not [System.IO.Path]::HasExtension($relPath)) {
          $candidatePath = Join-Path $root 'index.html'
        } else {
          $response.StatusCode = 404
          $bytes = [System.Text.Encoding]::UTF8.GetBytes('404 - File non trovato')
          $response.ContentType = 'text/plain; charset=utf-8'
          $response.ContentLength64 = $bytes.Length
          $response.OutputStream.Write($bytes, 0, $bytes.Length)
          $response.Close()
          continue
        }
      }

      $ext = [System.IO.Path]::GetExtension($candidatePath).ToLowerInvariant()
      $response.ContentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }
      $response.Headers.Add('Cache-Control', 'no-cache')

      $fileBytes = [System.IO.File]::ReadAllBytes($candidatePath)
      $response.StatusCode = 200
      $response.ContentLength64 = $fileBytes.Length
      $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
      $response.Close()
    } catch {
      try {
        $response.StatusCode = 500
        $response.Close()
      } catch {}
    }
  }
} finally {
  if ($listener) {
    $listener.Stop()
    $listener.Close()
  }
}

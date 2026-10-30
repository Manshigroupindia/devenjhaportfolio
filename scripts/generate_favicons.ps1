Add-Type -AssemblyName System.Drawing

function Create-FaviconBadge {
    param(
        [string]$sourcePath,
        [string]$destPath,
        [int]$size,
        [float]$paddingRatio = 0.12,
        [bool]$isCircle = $true
    )

    $src = [System.Drawing.Image]::FromFile($sourcePath)
    $bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    # Draw solid white circle
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    if ($isCircle) {
        $g.FillEllipse($brush, 0, 0, $size - 1, $size - 1)
    } else {
        $g.FillRectangle($brush, 0, 0, $size, $size)
    }

    # Calculate centered content bounds with padding
    $pad = [int]($size * $paddingRatio)
    $drawW = $size - (2 * $pad)
    $drawH = $size - (2 * $pad)
    $destRect = New-Object System.Drawing.Rectangle $pad, $pad, $drawW, $drawH

    $g.DrawImage($src, $destRect, 0, 0, $src.Width, $src.Height, [System.Drawing.GraphicsUnit]::Pixel)

    $g.Dispose()
    $brush.Dispose()
    $src.Dispose()

    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

$root = "F:\Office Work\Deven Jha Portfolio"
$imagePath = Join-Path $root "image.png"
$pub = Join-Path $root "public"

if (-not (Test-Path (Join-Path $pub "images"))) {
    New-Item -ItemType Directory -Path (Join-Path $pub "images") -Force
}

# 1. Copy unmodified original logo into public/images/logo.png
Copy-Item $imagePath (Join-Path $pub "images\logo.png") -Force

# 2. Generate PNG favicons with solid white circle background
Create-FaviconBadge -sourcePath $imagePath -destPath (Join-Path $pub "favicon-16x16.png") -size 16 -paddingRatio 0.08 -isCircle $true
Create-FaviconBadge -sourcePath $imagePath -destPath (Join-Path $pub "favicon-32x32.png") -size 32 -paddingRatio 0.10 -isCircle $true
Create-FaviconBadge -sourcePath $imagePath -destPath (Join-Path $pub "favicon-48x48.png") -size 48 -paddingRatio 0.10 -isCircle $true
Create-FaviconBadge -sourcePath $imagePath -destPath (Join-Path $pub "apple-touch-icon.png") -size 180 -paddingRatio 0.12 -isCircle $true
Create-FaviconBadge -sourcePath $imagePath -destPath (Join-Path $pub "android-chrome-192x192.png") -size 192 -paddingRatio 0.12 -isCircle $true
Create-FaviconBadge -sourcePath $imagePath -destPath (Join-Path $pub "android-chrome-512x512.png") -size 512 -paddingRatio 0.12 -isCircle $true

# Also create a high-res white-backed badge for navbar if needed
Create-FaviconBadge -sourcePath $imagePath -destPath (Join-Path $pub "images\logo-badge.png") -size 200 -paddingRatio 0.10 -isCircle $true

# 3. Assemble Windows ICO containing 16x16, 32x32, 48x48 PNG frames
$bytes16 = [System.IO.File]::ReadAllBytes((Join-Path $pub "favicon-16x16.png"))
$bytes32 = [System.IO.File]::ReadAllBytes((Join-Path $pub "favicon-32x32.png"))
$bytes48 = [System.IO.File]::ReadAllBytes((Join-Path $pub "favicon-48x48.png"))

$stream = New-Object System.IO.MemoryStream
$writer = New-Object System.IO.BinaryWriter $stream

# ICONDIR (6 bytes)
$writer.Write([uint16]0) # Reserved
$writer.Write([uint16]1) # Type (1 = ICO)
$writer.Write([uint16]3) # Count of images

$offset = 6 + (16 * 3) # 54 bytes

# Entry 1: 16x16
$writer.Write([byte]16)
$writer.Write([byte]16)
$writer.Write([byte]0)
$writer.Write([byte]0)
$writer.Write([uint16]1)
$writer.Write([uint16]32)
$writer.Write([uint32]$bytes16.Length)
$writer.Write([uint32]$offset)
$offset += $bytes16.Length

# Entry 2: 32x32
$writer.Write([byte]32)
$writer.Write([byte]32)
$writer.Write([byte]0)
$writer.Write([byte]0)
$writer.Write([uint16]1)
$writer.Write([uint16]32)
$writer.Write([uint32]$bytes32.Length)
$writer.Write([uint32]$offset)
$offset += $bytes32.Length

# Entry 3: 48x48
$writer.Write([byte]48)
$writer.Write([byte]48)
$writer.Write([byte]0)
$writer.Write([byte]0)
$writer.Write([uint16]1)
$writer.Write([uint16]32)
$writer.Write([uint32]$bytes48.Length)
$writer.Write([uint32]$offset)
$offset += $bytes48.Length

# Image data payloads
$writer.Write($bytes16, 0, $bytes16.Length)
$writer.Write($bytes32, 0, $bytes32.Length)
$writer.Write($bytes48, 0, $bytes48.Length)

[System.IO.File]::WriteAllBytes((Join-Path $pub "favicon.ico"), $stream.ToArray())

$writer.Dispose()
$stream.Dispose()

Write-Host "Favicon suite successfully generated in public directory!"


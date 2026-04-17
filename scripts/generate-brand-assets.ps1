$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$repoRoot = Split-Path -Parent $PSScriptRoot
$appDir = Join-Path $repoRoot 'app'
$fontsDir = Join-Path $env:WINDIR 'Fonts'

$serifFontPath = Join-Path $fontsDir 'georgia.ttf'
$serifBoldFontPath = Join-Path $fontsDir 'georgiab.ttf'
$sansFontPath = Join-Path $fontsDir 'segoeui.ttf'
$sansSemiBoldFontPath = Join-Path $fontsDir 'segoeuib.ttf'

function New-Color([int]$a, [int]$r, [int]$g, [int]$b) {
  return [System.Drawing.Color]::FromArgb($a, $r, $g, $b)
}

function New-RoundedRectanglePath([float]$x, [float]$y, [float]$width, [float]$height, [float]$radius) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = [Math]::Min($radius * 2, [Math]::Min($width, $height))

  $path.AddArc($x, $y, $diameter, $diameter, 180, 90)
  $path.AddArc($x + $width - $diameter, $y, $diameter, $diameter, 270, 90)
  $path.AddArc($x + $width - $diameter, $y + $height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($x, $y + $height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()

  return $path
}

function Initialize-Graphics([System.Drawing.Bitmap]$bitmap) {
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  return $graphics
}

function Save-ScaledPng([string]$sourcePath, [string]$targetPath, [int]$size) {
  $sourceImage = [System.Drawing.Image]::FromFile($sourcePath)
  $targetBitmap = New-Object System.Drawing.Bitmap($size, $size)
  $graphics = Initialize-Graphics $targetBitmap
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.DrawImage($sourceImage, 0, 0, $size, $size)
  $targetBitmap.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)

  $graphics.Dispose()
  $targetBitmap.Dispose()
  $sourceImage.Dispose()
}

function Save-IcoFromPng([string]$pngPath, [string]$icoPath) {
  $pngBytes = [System.IO.File]::ReadAllBytes($pngPath)
  $fileStream = [System.IO.File]::Open($icoPath, [System.IO.FileMode]::Create)
  $writer = New-Object System.IO.BinaryWriter($fileStream)

  $writer.Write([UInt16]0)
  $writer.Write([UInt16]1)
  $writer.Write([UInt16]1)
  $writer.Write([byte]0)
  $writer.Write([byte]0)
  $writer.Write([byte]0)
  $writer.Write([byte]0)
  $writer.Write([UInt16]1)
  $writer.Write([UInt16]32)
  $writer.Write([UInt32]$pngBytes.Length)
  $writer.Write([UInt32]22)
  $writer.Write($pngBytes)

  $writer.Flush()
  $writer.Dispose()
  $fileStream.Dispose()
}

function New-BrandIcon([string]$targetPath, [int]$size) {
  $bitmap = New-Object System.Drawing.Bitmap($size, $size)
  $graphics = Initialize-Graphics $bitmap

  $backgroundRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
  $backgroundBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $backgroundRect,
    (New-Color 255 20 17 14),
    (New-Color 255 58 48 38),
    45
  )
  $graphics.FillRectangle($backgroundBrush, $backgroundRect)

  $glowBrush = New-Object System.Drawing.SolidBrush((New-Color 54 201 169 110))
  $graphics.FillEllipse($glowBrush, [int]($size * 0.12), [int]($size * 0.08), [int]($size * 0.78), [int]($size * 0.78))

  $framePath = New-RoundedRectanglePath ([float]($size * 0.07)) ([float]($size * 0.07)) ([float]($size * 0.86)) ([float]($size * 0.86)) ([float]($size * 0.18))
  $frameFill = New-Object System.Drawing.SolidBrush((New-Color 208 26 23 20))
  $frameBorder = New-Object System.Drawing.Pen((New-Color 185 201 169 110), [Math]::Max(5, [int]($size * 0.016)))
  $graphics.FillPath($frameFill, $framePath)
  $graphics.DrawPath($frameBorder, $framePath)

  $accentPen = New-Object System.Drawing.Pen((New-Color 90 255 245 224), [Math]::Max(2, [int]($size * 0.006)))
  $graphics.DrawArc($accentPen, [int]($size * 0.17), [int]($size * 0.15), [int]($size * 0.66), [int]($size * 0.66), 200, 110)

  $titleFont = New-Object System.Drawing.Font($serifBoldFontPath, ($size * 0.42), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $subtitleFont = New-Object System.Drawing.Font($sansFontPath, ($size * 0.065), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $titleBrush = New-Object System.Drawing.SolidBrush((New-Color 255 232 213 163))
  $subtitleBrush = New-Object System.Drawing.SolidBrush((New-Color 235 201 169 110))
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center

  $graphics.DrawString('N', $titleFont, $titleBrush, (New-Object System.Drawing.RectangleF(0, [float]($size * 0.13), $size, [float]($size * 0.5))), $format)
  $graphics.DrawString('NEUE LIEBE', $subtitleFont, $subtitleBrush, (New-Object System.Drawing.RectangleF(0, [float]($size * 0.68), $size, [float]($size * 0.12))), $format)

  $bitmap.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)

  $format.Dispose()
  $subtitleBrush.Dispose()
  $titleBrush.Dispose()
  $subtitleFont.Dispose()
  $titleFont.Dispose()
  $accentPen.Dispose()
  $frameBorder.Dispose()
  $frameFill.Dispose()
  $framePath.Dispose()
  $glowBrush.Dispose()
  $backgroundBrush.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

function New-SocialCard([string]$targetPath) {
  $width = 1200
  $height = 630
  $bitmap = New-Object System.Drawing.Bitmap($width, $height)
  $graphics = Initialize-Graphics $bitmap

  $backgroundImage = $null
  foreach ($candidate in @(
    (Join-Path $repoRoot 'public\cafe_interior_1600x1200_optimized.webp'),
    (Join-Path $repoRoot 'public\cafe_interior_800x600_optimized.webp'),
    (Join-Path $repoRoot 'public\terasse.jpg')
  )) {
    if (-not [System.IO.File]::Exists($candidate)) {
      continue
    }

    try {
      $backgroundImage = [System.Drawing.Image]::FromFile($candidate)
      break
    } catch {
      $backgroundImage = $null
    }
  }

  if ($null -ne $backgroundImage) {
    $scale = [Math]::Max($width / $backgroundImage.Width, $height / $backgroundImage.Height)
    $drawWidth = [int][Math]::Ceiling($backgroundImage.Width * $scale)
    $drawHeight = [int][Math]::Ceiling($backgroundImage.Height * $scale)
    $drawX = [int](($width - $drawWidth) / 2)
    $drawY = [int](($height - $drawHeight) / 2)
    $graphics.DrawImage($backgroundImage, $drawX, $drawY, $drawWidth, $drawHeight)
  } else {
    $backgroundRect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
    $backgroundBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      $backgroundRect,
      (New-Color 255 18 15 13),
      (New-Color 255 58 48 38),
      20
    )
    $graphics.FillRectangle($backgroundBrush, $backgroundRect)
    $backgroundBrush.Dispose()
  }

  $topOverlay = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle(0, 0, $width, $height)),
    (New-Color 185 16 14 12),
    (New-Color 130 16 14 12),
    90
  )
  $graphics.FillRectangle($topOverlay, 0, 0, $width, $height)

  $leftFadeRect = New-Object System.Drawing.Rectangle(0, 0, [int]($width * 0.72), $height)
  $leftFadeBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $leftFadeRect,
    (New-Color 210 20 17 14),
    (New-Color 36 20 17 14),
    0
  )
  $graphics.FillRectangle($leftFadeBrush, $leftFadeRect)

  $framePen = New-Object System.Drawing.Pen((New-Color 112 201 169 110), 2)
  $graphics.DrawRectangle($framePen, 30, 28, 1140, 574)

  $eyebrowFont = New-Object System.Drawing.Font($sansSemiBoldFontPath, 20, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $titleFont = New-Object System.Drawing.Font($serifFontPath, 92, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $copyFont = New-Object System.Drawing.Font($sansFontPath, 30, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $microFont = New-Object System.Drawing.Font($sansSemiBoldFontPath, 18, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

  $goldBrush = New-Object System.Drawing.SolidBrush((New-Color 255 201 169 110))
  $creamBrush = New-Object System.Drawing.SolidBrush((New-Color 240 255 247 235))
  $mutedBrush = New-Object System.Drawing.SolidBrush((New-Color 224 229 221 208))

  $graphics.DrawString('RESTAURANT - TERRASSE - TANZ & EVENTS', $eyebrowFont, $goldBrush, 90, 108)
  $graphics.DrawString('Neue Liebe', $titleFont, $creamBrush, 84, 156)
  $graphics.DrawString('Stilvolles Restaurant in Nebra (Unstrut) mit regionaler Kuche, warmer Atmosphare und besonderen Abenden.', $copyFont, $mutedBrush, (New-Object System.Drawing.RectangleF(90, 306, 590, 130)))

  $linePen = New-Object System.Drawing.Pen((New-Color 255 201 169 110), 3)
  $graphics.DrawLine($linePen, 90, 468, 282, 468)

  $chipPath = New-RoundedRectanglePath 90 494 342 52 24
  $chipFill = New-Object System.Drawing.SolidBrush((New-Color 228 201 169 110))
  $chipTextBrush = New-Object System.Drawing.SolidBrush((New-Color 255 26 23 20))
  $graphics.FillPath($chipFill, $chipPath)
  $graphics.DrawString('NEBRA (UNSTRUT) - SACHSEN-ANHALT', $microFont, $chipTextBrush, (New-Object System.Drawing.RectangleF(106, 507, 310, 24)))

  $badgePath = New-RoundedRectanglePath 882 58 250 122 30
  $badgeFill = New-Object System.Drawing.SolidBrush((New-Color 176 24 21 18))
  $badgeBorder = New-Object System.Drawing.Pen((New-Color 138 232 213 163), 2)
  $badgeTitleFont = New-Object System.Drawing.Font($serifFontPath, 32, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $badgeCopyFont = New-Object System.Drawing.Font($sansSemiBoldFontPath, 14, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $badgeFormat = New-Object System.Drawing.StringFormat
  $badgeFormat.Alignment = [System.Drawing.StringAlignment]::Center
  $badgeFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
  $graphics.FillPath($badgeFill, $badgePath)
  $graphics.DrawPath($badgeBorder, $badgePath)
  $graphics.DrawString('Neue Liebe', $badgeTitleFont, $goldBrush, (New-Object System.Drawing.RectangleF(894, 72, 226, 44)), $badgeFormat)
  $graphics.DrawLine($badgeBorder, 938, 120, 1076, 120)
  $graphics.DrawString('Restaurant in Nebra', $badgeCopyFont, $creamBrush, (New-Object System.Drawing.RectangleF(894, 124, 226, 24)), $badgeFormat)

  $bitmap.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)

  if ($null -ne $backgroundImage) {
    $backgroundImage.Dispose()
  }
  $badgeFormat.Dispose()
  $badgeCopyFont.Dispose()
  $badgeTitleFont.Dispose()
  $badgeBorder.Dispose()
  $badgeFill.Dispose()
  $badgePath.Dispose()
  $chipTextBrush.Dispose()
  $chipFill.Dispose()
  $chipPath.Dispose()
  $linePen.Dispose()
  $mutedBrush.Dispose()
  $creamBrush.Dispose()
  $goldBrush.Dispose()
  $microFont.Dispose()
  $copyFont.Dispose()
  $titleFont.Dispose()
  $eyebrowFont.Dispose()
  $framePen.Dispose()
  $leftFadeBrush.Dispose()
  $topOverlay.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

$iconPngPath = Join-Path $appDir 'icon.png'
$appleIconPath = Join-Path $appDir 'apple-icon.png'
$faviconPngPath = Join-Path $appDir 'favicon-256.png'
$faviconIcoPath = Join-Path $appDir 'favicon.ico'
$ogImagePath = Join-Path $appDir 'opengraph-image.png'
$twitterImagePath = Join-Path $appDir 'twitter-image.png'

New-BrandIcon -targetPath $iconPngPath -size 512
Save-ScaledPng -sourcePath $iconPngPath -targetPath $appleIconPath -size 180
Save-ScaledPng -sourcePath $iconPngPath -targetPath $faviconPngPath -size 256
Save-IcoFromPng -pngPath $faviconPngPath -icoPath $faviconIcoPath
New-SocialCard -targetPath $ogImagePath
[System.IO.File]::Copy($ogImagePath, $twitterImagePath, $true)
[System.IO.File]::Delete($faviconPngPath)

Write-Host "Generated brand assets:"
Write-Host " - $iconPngPath"
Write-Host " - $appleIconPath"
Write-Host " - $faviconIcoPath"
Write-Host " - $ogImagePath"
Write-Host " - $twitterImagePath"

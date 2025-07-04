$inputFile = $Args[0]
$outputFile = $Args[1]
$jsonContent = Get-Content -Raw $inputFile -Encoding UTF8 | ConvertFrom-Json

Write-Output  '<?xml version="1.0" encoding="UTF-8"?>' | Out-File -Encoding utf8NoBOM -FilePath $outputFile
Write-Output  '<kml xmlns="http://earth.google.com/kml/2.0">' | Out-File -Append  -Encoding utf8NoBOM -FilePath $outputFile
Write-Output '<Folder>' | Out-File -Append  -Encoding utf8NoBOM -FilePath $outputFile
foreach($item in $jsonContent.ret)
{
	Write-Output  "<Placemark>" | Out-File -Append  -Encoding utf8NoBOM -FilePath $outputFile
	Write-Output  "<name>$($item.name)</name>" | Out-File -Append  -Encoding utf8NoBOM -FilePath $outputFile
	Write-Output  "<Point>" | Out-File -Append  -Encoding utf8NoBOM -FilePath $outputFile
	Write-Output  "<coordinates>$($item.___lng),$($item.___lat),0</coordinates>" | Out-File -Append  -Encoding utf8NoBOM -FilePath $outputFile
	Write-Output  "</Point>" | Out-File -Append  -Encoding utf8NoBOM -FilePath $outputFile
	Write-Output  "</Placemark>" | Out-File -Append  -Encoding utf8NoBOM -FilePath $outputFile
}
Write-Output '</Folder>' | Out-File -Append  -Encoding utf8NoBOM -FilePath $outputFile
Write-Output  "</kml>" | Out-File -Append  -Encoding utf8NoBOM -FilePath $outputFile

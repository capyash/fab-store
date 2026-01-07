' Cogniclaim Demo Launcher - VBScript Wrapper
' Author: Vinod Kumar V (VKV)
' This wrapper allows the batch file to have an icon and run hidden if needed

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get the directory where this script is located
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
batFile = scriptDir & "\Start Demo.bat"

' Check if batch file exists
If Not fso.FileExists(batFile) Then
    MsgBox "Error: Start Demo.bat not found in:" & vbCrLf & scriptDir, vbCritical, "Cogniclaim Launcher"
    WScript.Quit
End If

' Run the batch file in a visible window
WshShell.Run "cmd /c """ & batFile & """", 1, False

' Note: To add an icon to this VBS file:
' 1. Right-click the .vbs file
' 2. Create a shortcut
' 3. Right-click the shortcut -> Properties
' 4. Click "Change Icon"
' 5. Browse to an .ico file or use a system icon


@REM CD to text generation webui folder
cd A:\text-generation-webui

@REM get enviroment variables

@echo OFF
@echo | call A:\text-generation-webui\cmd_windows.bat

@REM run LLM
python one_click.py --api --nowebui --model ./models/open-llama-3b-v2-wizard-evol-instuct-v2-196k.Q3_K_M.gguf

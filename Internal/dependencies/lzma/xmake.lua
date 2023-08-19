-- lzma
-- 23.01 ?
-- https://www.7-zip.org/sdk.html

target('third.lzma', function()
	set_group('source/third')
	set_kind('static')
	add_headerfiles(
		'./7zTypes.h',
		'./7zWindows.h',
		'./Alloc.h',
		'./Compiler.h',
		'./CpuArch.h',
		'./IStream.h',
		'./LzFind.h',
		'./LzFindMt.h',
		'./LzHash.h',
		'./LzmaDec.h',
		'./LzmaEnc.h',
		'./LzmaLib.h',
		'./Precomp.h',
		'./Threads.h',
		{ install = false }
	)
	add_files(
		'./Alloc.c',
		'./CpuArch.c',
		'./LzFind.c',
		'./LzFindMt.c',
		'./LzFindOpt.c',
		'./LzmaDec.c',
		'./LzmaEnc.c',
		'./LzmaLib.c',
		'./Threads.c',
		{}
	)
	if m.system:is('windows') then
	end
	if m.system:is('linux', 'macintosh', 'android', 'iphone') then
		add_defines(
			'_7ZIP_ST',
			{}
		)
	end
	on_load(function(target)
		import('custom')
		custom.apply_compiler_option_basic(target)
		custom.apply_compiler_option_warning_disable(target)
	end)
end)

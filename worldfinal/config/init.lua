local TIME_LIMIT   = 10             -- seconds
local FLAGS        = { "-std=c++17", "-O2", "-Wall", "-Wextra", "-Wshadow" }
local IS_WIN       = vim.fn.has("win32") == 1
if vim.loader then vim.loader.enable() end -- byte-compile cache for lua modules (faster startup)
if IS_WIN then vim.o.shellslash = true end -- forward slashes everywhere -> paths compare equal
-- portable: config = folder of this init.lua, cache = per-user cache dir
local conf         = vim.fn.fnamemodify(debug.getinfo(1, "S").source:sub(2), ":p:h"):gsub("\\", "/")
local cache        = IS_WIN and (os.getenv("LOCALAPPDATA") or vim.fn.expand("~")):gsub("\\", "/") .. "/worldfinal/cache"
                     or (os.getenv("XDG_CACHE_HOME") or vim.fn.expand("~/.cache")) .. "/worldfinal"
local EXT          = IS_WIN and ".exe" or ".out"
vim.g.worldfinal_conf = conf
package.path = conf .. "/lua/?.lua;" .. package.path

---------------------------------------------------------------- performance: skip every builtin plugin / provider we never use
for _, p in ipairs { "netrw", "netrwPlugin", "netrwSettings", "netrwFileHandlers", "gzip", "zip", "zipPlugin", "tar",
  "tarPlugin", "getscript", "getscriptPlugin", "vimball", "vimballPlugin", "2html_plugin", "tohtml", "logiPat", "rrhelper",
  "spellfile_plugin", "tutor_mode_plugin", "man", "remote_plugins", "shada_plugin", "matchit", "health", "nvim_health" } do
  vim.g["loaded_" .. p] = 1
end
for _, p in ipairs { "python3", "python", "ruby", "node", "perl" } do vim.g["loaded_" .. p .. "_provider"] = 0 end
vim.g.editorconfig = false; vim.g.did_install_default_menus = 1; vim.g.did_install_syntax_menu = 1
vim.o.shadafile = "NONE"
local snip = require("cpsnip")
local o, map = vim.o, vim.keymap.set
local function keys(s) return vim.api.nvim_replace_termcodes(s, true, false, true) end

---------------------------------------------------------------- options
o.termguicolors = true; o.number = true; o.relativenumber = false
o.cursorline = true; o.cursorlineopt = "number"
o.expandtab = true; o.shiftwidth = 4; o.tabstop = 4; o.softtabstop = 4
o.smartindent = false; o.autoindent = true
o.mouse = "a"; o.regexpengine = 1; o.synmaxcol = 300; o.redrawtime = 1500; o.scrolloff = 5; o.sidescrolloff = 8
o.swapfile = false; o.backup = false; o.undofile = true; o.undodir = cache .. "/undo"
o.ignorecase = true; o.smartcase = true; o.hlsearch = true; o.incsearch = true
o.wrap = false; o.signcolumn = "no"; o.showmode = false; o.ruler = false
o.laststatus = 2; o.splitright = true; o.splitbelow = true
o.timeoutlen = 300; o.ttimeoutlen = 0; o.updatetime = 200
o.autowriteall = true; o.hidden = true; o.lazyredraw = false
o.completeopt = "menu,menuone,noselect"; o.pumheight = 12
o.fillchars = "eob: ,vert: "; o.shortmess = "filnxtToOFcI"
-- VS Code style: Shift+arrows select, typing replaces the selection
o.keymodel = "startsel,stopsel"; o.selectmode = "mouse,key"
o.whichwrap = "b,s,<,>,[,]"; o.backspace = "indent,eol,start"; o.virtualedit = "onemore"; o.selection = "exclusive"
o.guicursor = "n-v-c-sm:block,i-ci-ve:ver25,r-cr-o:hor20"
vim.fn.mkdir(cache .. "/undo", "p")
vim.g.mapleader = " "
vim.g.loaded_matchparen = 1 -- like editor.matchBrackets = never (lighter)
vim.cmd("filetype plugin indent on | syntax on")

---------------------------------------------------------------- theme: VS Code "Dark Modern" (colors copied from dark_modern/dark_plus/dark_vs)
local function hl(g, v) vim.api.nvim_set_hl(0, g, v) end
local C = { fg = "#cccccc", bg = "#1f1f1f", panel = "#181818", var = "#9cdcfe", fn = "#dcdcaa", ty = "#4ec9b0",
  kw = "#569cd6", ctl = "#c586c0", str = "#ce9178", num = "#b5cea8", cmt = "#6a9955", esc = "#d7ba7d", const = "#4fc1ff" }
local function theme()
  hl("Normal", { fg = C.fg, bg = C.bg }); hl("NormalNC", { fg = C.fg, bg = C.bg })
  hl("NormalPanel", { fg = C.fg, bg = C.panel }); hl("EndOfBufferPanel", { fg = C.panel, bg = C.panel })
  hl("EndOfBuffer", { fg = C.bg, bg = C.bg }); hl("LineNr", { fg = "#6e7681", bg = C.bg })
  hl("CursorLineNr", { fg = C.fg, bg = C.bg }); hl("CursorLine", { bg = C.bg })
  hl("Visual", { bg = "#264f78" }); hl("Search", { bg = "#613214" }); hl("IncSearch", { bg = "#9e6a03" })
  hl("Pmenu", { fg = C.fg, bg = "#202020" }); hl("PmenuSel", { fg = "#ffffff", bg = "#04395e" })
  hl("StatusLine", { fg = C.fg, bg = C.panel }); hl("StatusLineNC", { fg = "#8b949e", bg = C.panel })
  hl("WinSeparator", { fg = "#2b2b2b", bg = "#2b2b2b" }); hl("VertSplit", { fg = "#2b2b2b", bg = "#2b2b2b" })
  hl("MsgArea", { fg = C.fg, bg = C.bg }); hl("Error", { fg = "#f44747", bg = C.bg })
  -- comments / literals
  hl("Comment", { fg = C.cmt }); hl("String", { fg = C.str }); hl("Character", { fg = C.str })
  hl("cIncluded", { fg = C.str }); hl("cSpecial", { fg = C.esc }); hl("cFormat", { fg = C.var })
  hl("Number", { fg = C.num }); hl("Float", { fg = C.num }); hl("cNumber", { fg = C.num }); hl("cFloat", { fg = C.num })
  hl("cOctal", { fg = C.num }); hl("cOctalZero", { fg = C.num }); hl("cCppString", { fg = C.str })
  -- keywords: control flow / using / new / delete = purple, storage / types / true,false = blue
  for _, g in ipairs { "cStatement", "cConditional", "cRepeat", "cLabel", "cppStatement", "cppExceptions", "cInclude",
    "cppDirective", "cppCtl", "cppOperator", "cPreCondit", "cPreProc", "PreProc", "Include", "Define", "Macro", "Statement", "Conditional", "Repeat", "Label", "Exception" } do
    hl(g, { fg = C.ctl })
  end
  for _, g in ipairs { "cType", "cStorageClass", "cStructure", "cppStructure", "cppModifier", "cppType", "cppBoolean",
    "cConstant", "cOperator", "cppCast", "cDefine", "cppDefine", "cppUserMacro", "Type", "StorageClass", "Structure", "Typedef", "Boolean", "cppRawString" } do
    hl(g, { fg = C.kw })
  end
  hl("cppRawString", { fg = C.str }); hl("Operator", { fg = "#d4d4d4" }); hl("Constant", { fg = C.const })
  hl("Special", { fg = C.esc }); hl("Identifier", { fg = C.var }); hl("Function", { fg = C.fn })
  hl("cppIdent", { fg = C.var }); hl("cppFunc", { fg = C.fn }); hl("cppStd", { fg = C.ty }); hl("cppNs", { fg = C.ty })
  hl("cppUserType", { fg = C.ty }); hl("cppUserConst", { fg = C.const })
  hl("Todo", { fg = C.cmt }); hl("cTodo", { fg = C.cmt }); hl("cCommentL", { fg = C.cmt })
  hl("cppMacroName", { fg = C.kw }); hl("cppKw", { fg = C.kw }); hl("cppNumber", { fg = C.num }); hl("cppString", { fg = C.str })
  -- output panel (like the VS Code terminal / panel)
  hl("OutErr", { fg = "#f48771", bold = true }); hl("OutWarn", { fg = "#cca700" })
  hl("OutOk", { fg = "#89d185", bold = true }); hl("OutInfo", { fg = "#569cd6" })
end
theme()
-- names the file itself defines (like clangd semantic tokens in VS Code): macros = blue, typedef / using /
-- struct / class / template params = teal, const / constexpr variables = bright blue. re-scanned while typing (debounced)
local SYN_ARGS = {}
for w in ("contained containedin contains nextgroup transparent skipwhite skipnl skipempty conceal cchar oneline fold display extend keepend excludenl"):gmatch("%S+") do SYN_ARGS[w] = true end
local function scan_names(buf)
  local mac, ty, cst = {}, {}, {}
  local function add(t, n) if n and not SYN_ARGS[n] then t[n] = true end end
  for _, l in ipairs(vim.api.nvim_buf_get_lines(buf, 0, math.min(vim.api.nvim_buf_line_count(buf), 5000), false)) do
    local m = l:match("^%s*#%s*define%s+([%a_][%w_]*)")
    if m then add(mac, m)
    elseif not l:match("^%s*//") then
      add(ty, l:match("%f[%w_]typedef%f[^%w_].-([%a_][%w_]*)%s*;"))
      add(ty, l:match("%f[%w_]using%s+([%a_][%w_]*)%s*="))
      for _, kw in ipairs { "struct", "class", "union", "enum" } do
        for n in l:gmatch("%f[%w_]" .. kw .. "%s+([%a_][%w_]*)") do if n ~= "class" and n ~= "struct" then add(ty, n) end end
      end
      local tp = l:match("%f[%w_]template%s*(%b<>)")
      if tp then for n in tp:gmatch("%f[%w_]typename%s+([%a_][%w_]*)") do add(ty, n) end
        for n in tp:gmatch("%f[%w_]class%s+([%a_][%w_]*)") do add(ty, n) end end
      local rest = l:match("^%s*[%w_%s]-%f[%w_]constexpr%s+(.*)") or l:match("^%s*[%w_%s]-%f[%w_]const%s+(.*)")
      if rest and not l:match("^%s*for%f[^%w_]") then
        add(cst, rest:match("([%a_][%w_]*)%s*[=%[{;,]"))
        for n in rest:gmatch(",%s*([%a_][%w_]*)%s*[=%[{]") do add(cst, n) end
      end
    end
  end
  return mac, ty, cst
end
local function apply_names(buf)
  if not vim.api.nvim_buf_is_valid(buf) or not vim.bo[buf].syntax:match("^c") then return end
  local mac, ty, cst = scan_names(buf)
  local function keys_of(t) local r = vim.tbl_keys(t); table.sort(r); return r end
  local sets = { cppUserMacro = keys_of(mac), cppUserType = keys_of(ty), cppUserConst = keys_of(cst) }
  local sig = table.concat(sets.cppUserMacro, " ") .. "|" .. table.concat(sets.cppUserType, " ") .. "|" .. table.concat(sets.cppUserConst, " ")
  if vim.b[buf].cp_names == sig then return end -- nothing new: no syntax work at all
  vim.b[buf].cp_names = sig
  vim.api.nvim_buf_call(buf, function()
    for _, g in ipairs { "cppUserConst", "cppUserType", "cppUserMacro" } do -- macros last = highest priority
      vim.cmd("silent! syn clear " .. g)
      local list = sets[g]
      for i = 1, #list, 50 do vim.cmd("syn keyword " .. g .. " " .. table.concat(list, " ", i, math.min(i + 49, #list))) end
    end
  end)
end
local name_timer = {}
vim.api.nvim_create_autocmd({ "TextChanged", "BufWinEnter", "InsertLeave" }, { callback = function(a)
  if not vim.bo[a.buf].syntax:match("^c") then return end
  if name_timer[a.buf] then name_timer[a.buf]:stop() else name_timer[a.buf] = vim.loop.new_timer() end
  name_timer[a.buf]:start(500, 0, vim.schedule_wrap(function() apply_names(a.buf) end))
end })
vim.api.nvim_create_autocmd("BufWipeout", { callback = function(a)
  if name_timer[a.buf] then name_timer[a.buf]:close(); name_timer[a.buf] = nil end
end })

vim.api.nvim_create_autocmd("Syntax", { pattern = "cpp,c", callback = function(a)
  -- identifiers are light blue in VS Code; defined first so later matches (functions) win
  vim.cmd([[syn match cppIdent "\<[A-Za-z_]\w*\>"]])
  vim.cmd([[syn match cppNs "\<[A-Za-z_]\w*\ze\s*::"]])
  vim.cmd([[syn match cppFunc "\<[A-Za-z_]\w*\ze\s*("]])
  vim.cmd([[syn match cppFunc "\<[A-Za-z_]\w*\ze\s*<[^<>;()]*>\s*("]])
  vim.cmd([[syn keyword cppStd vector string map set unordered_map unordered_set pair queue deque stack priority_queue bitset array multiset multimap tuple list greater less function complex mt19937 mt19937_64 ostream istream stringstream istringstream ostringstream size_t int8_t int16_t int32_t int64_t uint8_t uint16_t uint32_t uint64_t ptrdiff_t string_view ios_base ios numeric_limits basic_string iterator random_device uniform_int_distribution uniform_real_distribution chrono steady_clock high_resolution_clock less_equal greater_equal equal_to hash optional variant span]])
  vim.cmd([[syn keyword cppKw this nullptr true false]])
  vim.cmd([[syn keyword cppNs std]])
  vim.cmd([[syn keyword cppCtl new delete operator co_return co_await co_yield]])
  -- #define line: "#define" purple, the rest blue (meta.preprocessor) like VS Code; plain identifiers stay blue there
  vim.cmd([[syn region cppDefine matchgroup=cppDirective start="^\s*\zs\%(%:\|#\)\s*\%(define\|undef\)\>" skip="\\$" end="$" keepend contains=ALLBUT,@cPreProcGroup,@Spell,cppIdent]])
  vim.cmd([[syn match cppMacroName "\(#\s*define\s\+\)\@<=[A-Za-z_]\w*"]])
  vim.b[a.buf].cp_names = nil
  apply_names(a.buf)
end })
vim.api.nvim_create_autocmd("FileType", { pattern = "c,cpp", callback = function()
  vim.opt_local.cindent = true
  vim.opt_local.cinoptions = "l1,g0,N-s,j1,(0,W4"
  vim.opt_local.formatoptions:remove({ "c", "r", "o" })
  vim.opt_local.commentstring = "// %s"
end })

---------------------------------------------------------------- auto pairs
local pairs_map = { ["("] = ")", ["["] = "]", ["{"] = "}" }
local function nextc()
  local l, c = vim.api.nvim_get_current_line(), vim.api.nvim_win_get_cursor(0)[2]
  return l:sub(c + 1, c + 1), l:sub(c, c)
end
for open, close in pairs(pairs_map) do
  map("i", open, function()
    local n = nextc()
    if n == "" or n:match("[%s%)%]}%;,]") then return open .. close .. "<Left>" end
    return open
  end, { expr = true })
  map("i", close, function() return nextc() == close and "<Right>" or close end, { expr = true })
end
for _, q in ipairs { '"', "'" } do
  map("i", q, function()
    local n, p = nextc()
    if n == q then return "<Right>" end
    if p:match("[%w_]") or n:match("[%w_]") then return q end
    return q .. q .. "<Left>"
  end, { expr = true })
end
map("i", "<BS>", function()
  if _G.CpAllTake() then return "" end
  local n, p = nextc()
  if n ~= "" and (pairs_map[p] == n or ((p == '"' or p == "'") and n == p)) then return "<BS><Del>" end
  return "<BS>"
end, { expr = true })
map("i", "<CR>", function()
  if _G.CpAllTake() then return "" end
  local n, p = nextc()
  if p == "{" and n == "}" then return "<C-g>u<CR><Esc>O" end
  return "<C-g>u<CR>"
end, { expr = true })

---------------------------------------------------------------- VS Code style keys (modeless: always typing, no vim modes)
-- break the undo chain at spaces so Ctrl+Z undoes word by word instead of the whole session
map("i", "<Space>", "<C-g>u<Space>")
map({ "i", "s", "x" }, "<C-z>", "<Cmd>undo<CR>"); map({ "i", "s", "x" }, "<C-y>", "<Cmd>redo<CR>")
map({ "i", "s", "x" }, "<C-S-z>", "<Cmd>redo<CR>")

-- text of the current selection (select or visual mode); nvim 0.9 has no getregion()
local function sel_text()
  local m = vim.fn.mode()
  local p1, p2 = vim.fn.getpos("v"), vim.fn.getpos(".")
  local l1, c1, l2, c2 = p1[2], p1[3], p2[2], p2[3]
  if l1 > l2 or (l1 == l2 and c1 > c2) then l1, c1, l2, c2 = l2, c2, l1, c1 end
  if m == "V" or m == "S" then
    return table.concat(vim.api.nvim_buf_get_lines(0, l1 - 1, l2, false), "\n") .. "\n"
  end
  if m == "\22" or m == "\19" then -- block: same columns on every line
    local a, b = math.min(c1, c2), math.max(c1, c2)
    local out = {}
    for _, l in ipairs(vim.api.nvim_buf_get_lines(0, l1 - 1, l2, false)) do out[#out + 1] = l:sub(a, b) end
    return table.concat(out, "\n")
  end
  -- 'selection' is exclusive (like VS Code): the char under the end position is not selected
  local e = math.min(c2 - 1, #vim.fn.getline(l2))
  local s1 = math.min(c1 - 1, #vim.fn.getline(l1))
  return table.concat(vim.api.nvim_buf_get_text(0, l1 - 1, s1, l2 - 1, e, {}), "\n")
end

-- Ctrl+A = select all WITHOUT moving the cursor or the view (like Notepad / VS Code):
-- the whole file is only highlighted; Ctrl+C copies it, typing / Backspace / Delete / Ctrl+V replaces it,
-- moving the cursor or clicking cancels it
local all_ns = vim.api.nvim_create_namespace("cp_selall")
local all = nil -- buffer that is "all selected"
local function all_clear()
  if all and vim.api.nvim_buf_is_valid(all) then vim.api.nvim_buf_clear_namespace(all, all_ns, 0, -1) end
  all = nil
end
local function all_on()
  if vim.fn.mode() ~= "i" then vim.api.nvim_feedkeys(keys("<Esc>"), "n", false) end
  vim.schedule(function()
    all_clear()
    all = vim.api.nvim_get_current_buf()
    vim.api.nvim_buf_set_extmark(all, all_ns, 0, 0, { end_row = vim.api.nvim_buf_line_count(all) - 1,
      end_col = #vim.api.nvim_buf_get_lines(all, -2, -1, false)[1],
      hl_group = "Visual", hl_eol = true, priority = 200 })
  end)
end
local function all_active() return all ~= nil and all == vim.api.nvim_get_current_buf() end
local function all_text() return table.concat(vim.api.nvim_buf_get_lines(0, 0, -1, false), "\n") end
local function all_wipe() -- delete everything (one undo step)
  all_clear()
  vim.api.nvim_buf_set_lines(0, 0, -1, false, { "" })
  vim.api.nvim_win_set_cursor(0, { 1, 0 })
end
vim.api.nvim_create_autocmd({ "CursorMovedI", "CursorMoved", "BufLeave", "WinLeave", "InsertLeave" }, { callback = all_clear })
vim.api.nvim_create_autocmd("ModeChanged", { pattern = "*:[vVsS\22\19]*", callback = all_clear })
-- typing a character replaces everything
vim.api.nvim_create_autocmd("InsertCharPre", { callback = function()
  if not all_active() then return end
  local ch = vim.v.char
  vim.v.char = ""
  all_clear()
  vim.schedule(function()
    all_wipe()
    vim.api.nvim_feedkeys(ch, "m", false) -- through the mappings (auto pairs)
  end)
end })

-- Ctrl+C: copy and KEEP the selection, never scroll (like VS Code)
local function copy() vim.fn.setreg("+", sel_text(), "c") end
local function paste()
  local t = vim.fn.getreg("+")
  if t ~= "" then vim.api.nvim_paste(t, false, -1) end
end
map({ "s", "x" }, "<C-c>", copy)
map({ "s", "x" }, "<C-x>", function() vim.fn.setreg("+", sel_text(), "c"); vim.api.nvim_feedkeys(keys('<C-g>"_d'), "n", false) end)
map("i", "<C-c>", function() if all_active() then vim.fn.setreg("+", all_text(), "c") end end) -- nothing selected: nothing
map("i", "<C-x>", function() if all_active() then vim.fn.setreg("+", all_text(), "c"); all_wipe() end end)
map("i", "<C-v>", function()
  if all_active() then all_wipe() end
  vim.api.nvim_feedkeys(keys("<C-g>u"), "n", false); vim.schedule(paste)
end)
map({ "s", "x" }, "<C-v>", function()
  vim.api.nvim_feedkeys(keys('<C-g>"_c'), "n", false)
  vim.schedule(paste)
end)
map({ "i", "s", "x" }, "<C-a>", all_on)
map("x", "<BS>", '"_d'); map("x", "<Del>", '"_d')
-- Backspace / Delete / Enter on select-all: delete everything
_G.CpAllTake = function()
  if not all_active() then return false end
  vim.schedule(all_wipe); return true
end
map("i", "<Del>", function() return _G.CpAllTake() and "" or "<Del>" end, { expr = true })
map("i", "<C-h>", "<C-g>u<C-w>"); map("i", "<C-BS>", "<C-g>u<C-w>")
map("i", "<C-Del>", "<C-g>u<C-o>dw")
-- Esc: only closes the suggestion popup, never leaves typing mode
map("i", "<Esc>", function() return vim.fn.pumvisible() == 1 and "<C-e>" or "" end, { expr = true })
-- Home: first non-blank char, press again for column 0 (VS Code)
map("i", "<Home>", function()
  local c, l = vim.api.nvim_win_get_cursor(0), vim.api.nvim_get_current_line()
  local ind = #l:match("^%s*")
  vim.api.nvim_win_set_cursor(0, { c[1], c[2] == ind and 0 or ind })
end)
-- Tab / Shift-Tab: expand snippet, jump tabstops, indent
local function indent_sel(dir)
  local a, b = vim.fn.line("v"), vim.fn.line("."); if a > b then a, b = b, a end
  vim.cmd(string.format("silent %d,%d%s", a, b, dir > 0 and ">" or "<"))
end
map("i", "<Tab>", function() if all_active() then vim.cmd("silent %>") else snip.tab() end end)
map({ "s", "x" }, "<Tab>", function() if not snip.jump(1) then indent_sel(1) end end)
map("i", "<S-Tab>", function()
  if all_active() then vim.cmd("silent %<"); return end
  if not snip.jump(-1) then vim.api.nvim_feedkeys(keys("<C-d>"), "n", false) end
end)
map({ "s", "x" }, "<S-Tab>", function() if not snip.jump(-1) then indent_sel(-1) end end)
vim.api.nvim_create_autocmd("TextChangedI", { callback = function() snip.auto() end })

-- comment: Ctrl+/ (terminals send <C-_>)
local function toggle_comment(l1, l2)
  local lines = vim.api.nvim_buf_get_lines(0, l1 - 1, l2, false)
  local all, min = true, 1e9
  for _, l in ipairs(lines) do
    if l:match("%S") then
      if not l:match("^%s*//") then all = false end
      min = math.min(min, #l:match("^%s*"))
    end
  end
  for i, l in ipairs(lines) do
    if l:match("%S") then
      if all then lines[i] = l:gsub("^(%s*)// ?", "%1", 1)
      else lines[i] = l:sub(1, min) .. "// " .. l:sub(min + 1) end
    end
  end
  vim.api.nvim_buf_set_lines(0, l1 - 1, l2, false, lines)
end
for _, k in ipairs { "<C-_>", "<C-/>" } do
  map("i", k, function()
    if all_active() then toggle_comment(1, vim.fn.line("$")) else local r = vim.fn.line("."); toggle_comment(r, r) end
  end)
  map({ "s", "x" }, k, function()
    local a, b = vim.fn.line("v"), vim.fn.line("."); if a > b then a, b = b, a end
    toggle_comment(a, b) -- selection stays
  end)
end
map({ "n", "i", "s", "x" }, "<C-q>", "<Cmd>silent! wall | qall!<CR>")

vim.api.nvim_create_autocmd("QuitPre", { callback = function()
  vim.cmd("silent! wall")
  vim.schedule(function() vim.cmd("qall!") end)
end })

---------------------------------------------------------------- no vim modes: a text buffer is always in typing mode
-- the output panel is a scratch pad too: editable, overwritten on every run
local function typing_buf() return (vim.bo.buftype == "" or vim.b.cp_scratch) and vim.bo.modifiable end
local function ensure_insert()
  vim.schedule(function()
    if vim.fn.mode() == "n" and typing_buf() then vim.cmd("startinsert") end
  end)
end
vim.api.nvim_create_autocmd("ModeChanged", { pattern = "*:n", callback = ensure_insert })
vim.api.nvim_create_autocmd({ "BufEnter", "WinEnter" }, { callback = function()
  if typing_buf() then ensure_insert()
  elseif vim.bo.buftype ~= "terminal" then vim.cmd("stopinsert") end
end })

---------------------------------------------------------------- autosave on focus change
vim.api.nvim_create_autocmd({ "FocusLost", "BufLeave", "WinLeave", "InsertLeave" }, { callback = function()
  if vim.bo.buftype == "" and vim.bo.modified and vim.fn.expand("%") ~= "" then vim.cmd("silent! update") end
end })

---------------------------------------------------------------- layout + run
local S = { stamp = {}, src = nil, inp = nil, win = {}, out = nil, job = nil }

-- precompiled header for bits/stdc++.h -> much faster compile.
-- built in the background at startup, so even the first Ctrl+S never waits for it (until ready: plain compile)
local PCH = { dir = cache .. "/pch", gch = cache .. "/pch/bits/stdc++.h.gch", sig = cache .. "/pch/flags.txt", busy = false }
local function pch_valid()
  if vim.fn.filereadable(PCH.gch) ~= 1 then return false end
  local f = io.open(PCH.sig, "r")
  if not f then return false end
  local s = f:read("*a")
  f:close()
  return s == table.concat(FLAGS, " ")
end
local function pch_build()
  if PCH.busy or pch_valid() or vim.fn.executable("g++") == 0 then return end
  PCH.busy = true
  local pre = {}
  local j = vim.fn.jobstart({ "g++", "-std=c++17", "-x", "c++", "-E", "-" }, {
    stdout_buffered = true,
    on_stdout = function(_, d) pre = d end,
    on_exit = function()
      local hdr
      for _, l in ipairs(pre) do
        hdr = l:match('^#.-"(.-bits[/\\]+stdc%+%+%.h)"')
        if hdr then break end
      end
      if not hdr then PCH.busy = false; return end
      hdr = hdr:gsub("\\\\", "\\")
      vim.fn.mkdir(PCH.dir .. "/bits", "p")
      local tmp = PCH.gch .. ".tmp"
      local pch_cmd = { "g++" }
      vim.list_extend(pch_cmd, FLAGS)
      vim.list_extend(pch_cmd, { "-x", "c++-header", hdr, "-o", tmp })
      vim.fn.jobstart(pch_cmd, { on_exit = function(_, c)
        if c == 0 then
          vim.loop.fs_rename(tmp, PCH.gch)
          local sf = io.open(PCH.sig, "w")
          if sf then sf:write(table.concat(FLAGS, " ")); sf:close() end
        else
          os.remove(tmp)
        end
        PCH.busy = false
      end })
    end,
  })
  if j > 0 then vim.fn.chansend(j, "#include <bits/stdc++.h>\n"); vim.fn.chanclose(j, "stdin") else PCH.busy = false end
end
local function pch_dir()
  if pch_valid() then return PCH.dir end
  pch_build()
  return nil
end

-- run bin < input with a time limit; stdout+stderr merged, capped at 2MB. cb(lines, exit_code) — 124 = TLE
local CAP = 2000000
local function exec(bin, inp, cb)
  if not (IS_WIN or os.getenv("WF_NATIVE_RUN")) then -- Linux / macOS: exactly the shell pipeline the editor always used
    local out = {}
    local rc = string.format("set -o pipefail; timeout %d %s < %s 2>&1 | head -c %d",
      TIME_LIMIT, vim.fn.shellescape(bin), vim.fn.shellescape(inp), CAP)
    return vim.fn.jobstart({ "bash", "-c", rc }, {
      stdout_buffered = true,
      on_stdout = function(_, d) out = d end,
      on_exit = function(_, code) cb(out, code) end,
    })
  end
  -- Windows: no bash/timeout -> native job, stdin fed from the file, timer kills it
  local acc, size, tle, job = { "" }, 0, false, nil
  local function feed(_, d)
    if size > CAP then return end
    for i, s in ipairs(d) do
      size = size + #s + 1
      if i == 1 then acc[#acc] = acc[#acc] .. s else acc[#acc + 1] = s end
    end
    if size > CAP then pcall(vim.fn.jobstop, job) end
  end
  job = vim.fn.jobstart({ bin }, {
    on_stdout = feed, on_stderr = feed,
    on_exit = function(_, code)
      for i, l in ipairs(acc) do acc[i] = l:gsub("\r$", "") end
      cb(acc, tle and 124 or code)
    end,
  })
  if job <= 0 then cb({ "cannot start " .. bin }, 1); return job end
  local fh = io.open(inp, "rb")
  local data = fh and fh:read("*a") or ""
  if fh then fh:close() end
  if data ~= "" then vim.fn.chansend(job, data) end
  vim.fn.chanclose(job, "stdin")
  vim.defer_fn(function()
    if vim.fn.jobwait({ job }, 0)[1] == -1 then tle = true; pcall(vim.fn.jobstop, job) end
  end, TIME_LIMIT * 1000)
  return job
end

local function set_out(lines)
  local b = S.out
  vim.api.nvim_buf_set_lines(b, 0, -1, false, lines) -- overwrites whatever was typed there
  vim.bo[b].modified = false
  for i, l in ipairs(lines) do
    local g
    if l:match("error:") or l:match("^%[RE") or l:match("^%[TLE") or l:match("^%[CE") then g = "OutErr"
    elseif l:match("warning:") then g = "OutWarn"
    elseif l:match("^%[OK") then g = "OutOk"
    elseif l:match("^══") then g = "OutInfo" end
    if g then vim.api.nvim_buf_add_highlight(b, -1, g, i - 1, 0, -1) end
  end
end

local function run()
  vim.cmd("silent! wall")
  S.src = vim.api.nvim_buf_get_name(vim.api.nvim_win_get_buf(S.win.code))
  if S.job then pcall(vim.fn.jobstop, S.job); S.job = nil end
  local name = vim.fn.fnamemodify(S.src, ":t:r")
  local bin = cache .. "/" .. name .. EXT
  if vim.fn.executable("g++") == 0 then
    set_out({ "[CE] g++ not found in PATH",
      IS_WIN and "══ install MinGW-w64 (e.g. winlibs.com or MSYS2) and add its bin folder to PATH, then reopen the terminal"
              or "══ install it: sudo apt install g++   (or your distro's equivalent)" })
    return
  end
  local flags = vim.deepcopy(FLAGS)
  local pch = pch_dir()
  local cmd = { "g++", "-pipe" }
  vim.list_extend(cmd, flags)
  if pch then vim.list_extend(cmd, { "-I", pch }) end
  vim.list_extend(cmd, { S.src, "-o", bin })
  local st = vim.loop.fs_stat(S.src)
  local stamp = st.mtime.sec .. "." .. st.mtime.nsec .. ":" .. st.size
  local fresh = S.stamp[bin] == stamp and vim.fn.filereadable(bin) == 1
  S.stamp[bin] = nil
  set_out({ "══ " .. "Compiling " .. vim.fn.fnamemodify(S.src, ":t") .. " ..." })
  local t0, buf = vim.loop.hrtime(), {}
  local on_exit = function(_, code)
      local ct = (vim.loop.hrtime() - t0) / 1e9
      for i, l in ipairs(buf) do buf[i] = l:gsub("\r$", "") end
      while #buf > 0 and buf[#buf] == "" do table.remove(buf) end
      if code ~= 0 then
        local lines = { string.format("[CE] Compile error  (%.2fs)", ct) }
        vim.list_extend(lines, buf)
        set_out(lines)
        vim.fn.setqflist({}, " ", { lines = buf, efm = "%f:%l:%c: %trror: %m,%E%f:%l:%c: fatal error: %m,%f:%l:%c: %tarning: %m,%-G%.%#" })
        local first
        for _, e in ipairs(vim.fn.getqflist()) do if e.type:lower() == "e" and e.lnum > 0 then first = e; break end end
        if first then
          vim.api.nvim_set_current_win(S.win.code)
          pcall(vim.api.nvim_win_set_cursor, 0, { first.lnum, math.max(first.col - 1, 0) })
          vim.cmd("normal! zz")
        end
        S.job = nil; return
      end
      S.stamp[bin] = stamp
      vim.fn.setqflist({}, "r")
      local t1 = vim.loop.hrtime()
      S.job = exec(bin, S.inp, function(out, rcode)
          local rt = (vim.loop.hrtime() - t1) / 1e9
          while #out > 0 and out[#out] == "" do table.remove(out) end
          local lines = vim.list_extend({}, out)
          local tag = rcode == 0 and "[OK]" or (rcode == 124 and "[TLE]" or "[RE]")
          if #buf > 0 then -- compiler warnings
            lines[#lines + 1] = ""; vim.list_extend(lines, buf)
          end
          lines[#lines + 1] = ""
          lines[#lines + 1] = string.format("%s exit=%d  compile %.2fs%s  run %.3fs%s%s", tag, rcode, ct, fresh and " (cached)" or "", rt,
            pch and "  (pch)" or "", "")
          set_out(lines)
          S.job = nil
      end)
  end
  if fresh then on_exit(nil, 0); return end -- unchanged source: skip the compiler entirely
  S.job = vim.fn.jobstart(cmd, {
    stdout_buffered = true, stderr_buffered = true,
    on_stdout = function(_, d) vim.list_extend(buf, d) end,
    on_stderr = function(_, d) vim.list_extend(buf, d) end,
    on_exit = on_exit,
  })
end

local function focus(w) if S.win[w] and vim.api.nvim_win_is_valid(S.win[w]) then vim.api.nvim_set_current_win(S.win[w]) end end

local function setup_layout(src)
  S.src = vim.fn.fnamemodify(src, ":p")
  S.inp = vim.fn.fnamemodify(S.src, ":h") .. "/input.txt"
  if vim.fn.filereadable(S.inp) == 0 then vim.fn.writefile({}, S.inp) end
  vim.cmd("edit " .. vim.fn.fnameescape(S.src))
  S.win.code = vim.api.nvim_get_current_win()
  vim.cmd("vsplit " .. vim.fn.fnameescape(S.inp))
  vim.cmd("wincmd L")
  S.win.input = vim.api.nvim_get_current_win()
  vim.cmd("belowright new")
  S.win.out = vim.api.nvim_get_current_win()
  S.out = vim.api.nvim_get_current_buf()
  vim.bo[S.out].buftype = "nofile"; vim.bo[S.out].bufhidden = "hide"; vim.bo[S.out].swapfile = false
  vim.b[S.out].cp_scratch = true
  vim.api.nvim_buf_set_name(S.out, "[output]")
  vim.wo[S.win.out].number = false; vim.wo[S.win.out].cursorline = false
  vim.wo[S.win.out].winhighlight = "Normal:NormalPanel,NormalNC:NormalPanel,EndOfBuffer:EndOfBufferPanel"
  vim.api.nvim_win_set_width(S.win.input, math.floor(vim.o.columns * 0.38))
  vim.api.nvim_win_set_height(S.win.out, math.floor((vim.o.lines - 2) * 0.62))
  set_out({ "══ Ctrl+S: save + run · Ctrl+N: new file · Ctrl+`: terminal (F4)",
            "══ Alt+1 code · Alt+2 input.txt · Alt+3 output · Ctrl+Q: quit" })
  vim.api.nvim_set_current_win(S.win.code)
  local b = vim.api.nvim_get_current_buf()
  -- empty file -> insert the "cp" template
  if vim.api.nvim_buf_line_count(b) == 1 and vim.api.nvim_buf_get_lines(b, 0, 1, false)[1] == "" then
    vim.schedule(function() snip.expand_named("cp") end)
  else vim.cmd("startinsert") end
end

map({ "n", "i", "s", "x" }, "<C-s>", function() run() end) -- Ctrl+S = save + compile + run
map({ "n", "i", "s", "x" }, "<F5>", function() run() end)
map({ "n", "i" }, "<A-1>", function() focus("code") end)
map({ "n", "i" }, "<A-2>", function() focus("input") end)
map({ "n", "i" }, "<A-3>", function() focus("out") end)

---------------------------------------------------------------- file tabs (blue bar under the code, click to switch, + to create)
hl("TabBar", { fg = "#ffffff", bg = "#007acc" }); hl("TabAct", { fg = "#007acc", bg = "#ffffff", bold = true })
hl("TabPlus", { fg = "#ffffff", bg = "#005f9e", bold = true })
o.statusline = "%!v:lua.CpStatus()" -- global, so `:edit` can never reset it (a window-local value was lost on the 1st file switch)
function _G.CpStatus()
  if S.win and vim.g.statusline_winid == S.win.code then return CpTabs() end
  return "%#StatusLine# %{expand('%:t')}%m  %=Ln %l, Col %c  "
end

-- open files, in tab order (a new file is listed immediately, even before it exists on disk)
local function src_files()
  if not S.files then
    S.files = {}
    for _, f in ipairs(vim.fn.glob(vim.fn.fnamemodify(S.src, ":h") .. "/*.cpp", false, true)) do
      S.files[#S.files + 1] = vim.fn.fnamemodify(f, ":p")
    end
    table.sort(S.files)
  end
  if not vim.tbl_contains(S.files, S.src) then S.files[#S.files + 1] = S.src end
  return S.files
end

local function open_file(path)
  path = vim.fn.fnamemodify(path, ":p")
  if not (S.win.code and vim.api.nvim_win_is_valid(S.win.code)) then return end
  vim.api.nvim_set_current_win(S.win.code)
  vim.cmd("silent! update")
  vim.cmd("edit " .. vim.fn.fnameescape(path))
  S.src = path
  src_files()
  local b = vim.api.nvim_get_current_buf()
  if vim.api.nvim_buf_line_count(b) == 1 and vim.api.nvim_buf_get_lines(b, 0, 1, false)[1] == "" then
    vim.schedule(function() snip.expand_named("cp") end)
  end
  vim.cmd("redrawstatus!")
end

local function new_file()
  local name = vim.fn.input("New file (e.g. C.cpp): ")
  vim.cmd("redraw")
  name = vim.trim(name)
  if name == "" then return end
  if not name:match("%.%w+$") then name = name .. ".cpp" end
  open_file(vim.fn.fnamemodify(S.src, ":h") .. "/" .. name)
end

-- Ctrl+Tab / Ctrl+Shift+Tab: cycle through the file tabs
local function cycle(dir)
  local files = src_files()
  local cur = vim.fn.fnamemodify(vim.api.nvim_buf_get_name(S.win.code and vim.api.nvim_win_get_buf(S.win.code) or 0), ":p")
  local idx = 1
  for i, f in ipairs(files) do if f == cur then idx = i end end
  open_file(files[(idx - 1 + dir) % #files + 1])
end

function _G.CpTabClick(idx, _, button)
  if button ~= "l" then return end
  vim.schedule(function()
    if idx == 0 then new_file() else local f = src_files()[idx]; if f then open_file(f) end end
  end)
end

function _G.CpTabs()
  local cur = vim.api.nvim_buf_get_name(0)
  local parts = { "%#TabBar# " }
  for i, f in ipairs(src_files()) do
    local act = vim.fn.fnamemodify(f, ":p") == cur
    parts[#parts + 1] = string.format("%%%d@v:lua.CpTabClick@%s %s%s %%X", i, act and "%#TabAct#" or "%#TabBar#",
      vim.fn.fnamemodify(f, ":t"), (act and vim.bo.modified) and " ●" or "")
  end
  parts[#parts + 1] = "%0@v:lua.CpTabClick@%#TabPlus# + %X%#TabBar#%=Ln %l, Col %c  "
  return table.concat(parts)
end

for _, k in ipairs { "<C-Tab>", "<C-PageDown>", "<A-.>" } do map({ "n", "i", "s", "x" }, k, function() cycle(1) end) end
for _, k in ipairs { "<C-S-Tab>", "<C-PageUp>", "<A-,>" } do map({ "n", "i", "s", "x" }, k, function() cycle(-1) end) end
map({ "n", "i", "s", "x" }, "<C-n>", function() new_file() end)

---------------------------------------------------------------- terminal: Ctrl+` (or F4) toggles a bottom terminal like VS Code
local function toggle_term()
  if S.term_win and vim.api.nvim_win_is_valid(S.term_win) then
    vim.api.nvim_win_close(S.term_win, true); S.term_win = nil
    focus("code"); return
  end
  vim.cmd("botright 12new")
  S.term_win = vim.api.nvim_get_current_win()
  if S.term_buf and vim.api.nvim_buf_is_valid(S.term_buf) then
    vim.api.nvim_win_set_buf(S.term_win, S.term_buf)
  else
    vim.fn.termopen(vim.o.shell, { cwd = vim.fn.fnamemodify(S.src, ":h") })
    S.term_buf = vim.api.nvim_get_current_buf()
    vim.bo[S.term_buf].bufhidden = "hide"
  end
  vim.wo[S.term_win].number = false
  vim.wo[S.term_win].winhighlight = "Normal:NormalPanel,EndOfBuffer:EndOfBufferPanel"
  vim.cmd("startinsert")
end
for _, k in ipairs { "<C-`>", "<C-@>", "<C-~>", "<F4>" } do
  map({ "n", "i", "s", "x", "t" }, k, toggle_term)
end
map("t", "<A-1>", function() vim.cmd("stopinsert"); focus("code") end)

vim.api.nvim_create_autocmd("VimEnter", { once = true, callback = function()
  local f = vim.fn.argv(0)
  if f and f ~= "" then setup_layout(f) end
  vim.defer_fn(pch_build, 50) -- warm the precompiled header in the background (first run only)
end })


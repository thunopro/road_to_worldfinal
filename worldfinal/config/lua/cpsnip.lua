-- Loads VS Code snippets (*.code-snippets); Tab expands, Tab / Shift-Tab jump between $1 $2 ... $0
local M = {}
local dir = (vim.g.worldfinal_conf or vim.fn.expand("~/.config/worldfinal")) .. "/snippets" -- bundled VS Code snippets
local snippets = {} -- prefix -> {body=string, scope=string|nil}

local function strip_json(s)
  -- strip // comments outside strings and trailing commas (VS Code allows JSONC)
  local out, i, n, in_str = {}, 1, #s, false
  while i <= n do
    local c = s:sub(i, i)
    if in_str then
      out[#out + 1] = c
      if c == "\\" then out[#out + 1] = s:sub(i + 1, i + 1); i = i + 1
      elseif c == '"' then in_str = false end
    elseif c == '"' then in_str = true; out[#out + 1] = c
    elseif c == "/" and s:sub(i + 1, i + 1) == "/" then
      while i <= n and s:sub(i, i) ~= "\n" do i = i + 1 end
      out[#out + 1] = "\n"
    else out[#out + 1] = c end
    i = i + 1
  end
  return (table.concat(out):gsub(",%s*([%]}])", "%1"))
end

function M.load()
  snippets = {}
  for _, f in ipairs(vim.fn.glob(dir .. "/*.code-snippets", false, true)) do
    local fh = io.open(f)
    if fh then
      local ok, data = pcall(vim.json.decode, strip_json(fh:read("*a")))
      fh:close()
      if ok and type(data) == "table" then
        for _, sn in pairs(data) do
          local body = type(sn.body) == "table" and table.concat(sn.body, "\n") or sn.body
          local prefixes = type(sn.prefix) == "table" and sn.prefix or { sn.prefix }
          for _, p in ipairs(prefixes) do
            if p and body then snippets[p] = { body = body, scope = sn.scope } end
          end
        end
      end
    end
  end
end

local ns = vim.api.nvim_create_namespace("cpsnip")
local session -- {marks = {{n=1,id=..}, ...}, cur = idx}

local function parse(body)
  -- returns plain text and the tabstop list {n, row, col, len}
  local text, stops, row, col = {}, {}, 0, 0
  local i, n = 1, #body
  local function put(str)
    for ch in str:gmatch(".") do
      text[#text + 1] = ch
      if ch == "\n" then row = row + 1; col = 0 else col = col + 1 end
    end
  end
  while i <= n do
    local c = body:sub(i, i)
    if c == "\\" and i < n then put(body:sub(i + 1, i + 1)); i = i + 2
    elseif c == "$" then
      local num, e = body:match("^(%d+)()", i + 1)
      if num then
        stops[#stops + 1] = { n = tonumber(num), row = row, col = col, len = 0 }
        i = e
      else
        local num2, def, e2 = body:match("^{(%d+):([^}]*)}()", i + 1)
        if num2 then
          stops[#stops + 1] = { n = tonumber(num2), row = row, col = col, len = #def }
          put(def); i = e2
        else put(c); i = i + 1 end
      end
    else put(c); i = i + 1 end
  end
  return table.concat(text), stops
end

-- session is only valid while the cursor is still on the current tabstop of the same buffer
local function in_session()
  if not session then return false end
  if session.buf ~= vim.api.nvim_get_current_buf() then session = nil; return false end
  local m = session.marks[session.cur]
  local ok, pos = pcall(vim.api.nvim_buf_get_extmark_by_id, 0, ns, m.id, { details = true })
  if not ok or #pos == 0 then session = nil; return false end
  local cur = vim.api.nvim_win_get_cursor(0)
  local r, c = cur[1] - 1, cur[2]
  local er, ec = pos[3].end_row, pos[3].end_col
  if r < pos[1] or r > er or (r == pos[1] and c < pos[2]) or (r == er and c > ec) then session = nil; return false end
  return true
end

local function goto_stop(idx)
  local m = session.marks[idx]
  local pos = vim.api.nvim_buf_get_extmark_by_id(0, ns, m.id, { details = true })
  local r, c, d = pos[1], pos[2], pos[3]
  local er, ec = d.end_row, d.end_col
  local ins = vim.fn.mode() == "i"
  session.cur = idx
  -- stay in typing mode: never drop to normal mode (the editor is modeless)
  if er == r and ec == c then
    vim.api.nvim_win_set_cursor(0, { r + 1, c })
    if not ins then vim.cmd("startinsert") end
  else
    vim.api.nvim_win_set_cursor(0, { r + 1, c })
    local sel = "v<Cmd>call cursor(" .. (er + 1) .. "," .. ec .. ")<CR><C-g>"
    vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes((ins and "<C-o>" or "") .. sel, true, false, true), "n", false)
  end
end

function M.expand(body)
  local text, stops = parse(body)
  local row, col = unpack(vim.api.nvim_win_get_cursor(0))
  local line = vim.api.nvim_get_current_line()
  local indent = line:match("^%s*")
  local lines = vim.split(text, "\n", { plain = true })
  for k = 2, #lines do lines[k] = indent .. lines[k] end
  local before, after = line:sub(1, col), line:sub(col + 1)
  local first_len = #lines[1]
  lines[1] = before .. lines[1]
  lines[#lines] = lines[#lines] .. after
  vim.api.nvim_buf_set_lines(0, row - 1, row, false, lines)
  vim.api.nvim_buf_clear_namespace(0, ns, 0, -1)
  local marks = {}
  for _, s in ipairs(stops) do
    local r = row - 1 + s.row
    local c = (s.row == 0) and (#before + s.col) or (#indent + s.col)
    local id = vim.api.nvim_buf_set_extmark(0, ns, r, c, { end_row = r, end_col = c + s.len, right_gravity = false, end_right_gravity = true })
    marks[#marks + 1] = { n = s.n, id = id }
  end
  -- order: 1,2,3..., $0 last
  table.sort(marks, function(a, b) local x, y = a.n == 0 and 1e9 or a.n, b.n == 0 and 1e9 or b.n; return x < y end)
  if #marks == 0 then
    local lr = row - 1 + #lines - 1
    vim.api.nvim_win_set_cursor(0, { lr + 1, #lines[#lines] - #after })
    session = nil
    return
  end
  session = { marks = marks, cur = 1, buf = vim.api.nvim_get_current_buf() }
  goto_stop(1)
end

local function word_before()
  local col = vim.api.nvim_win_get_cursor(0)[2]
  local line = vim.api.nvim_get_current_line():sub(1, col)
  return line:match("([%w_]+)$")
end

local function allowed(sn)
  if not sn.scope then return true end
  local ft = vim.bo.filetype
  for s in sn.scope:gmatch("[^,%s]+") do if s == ft or (s == "cpp" and ft == "c") then return true end end
  return false
end

-- Tab in insert mode: expand snippet if a prefix matches, jump tabstop, or insert a plain tab
local function candidates(w)
  local items = {}
  for p, sn in pairs(snippets) do
    if allowed(sn) and p:sub(1, #w) == w then items[#items + 1] = { word = p, menu = "[snippet]" } end
  end
  table.sort(items, function(a, b) return a.word < b.word end)
  return items
end

local auto_timer = nil
function M.auto()
  if vim.fn.mode() ~= "i" then return end
  if auto_timer then auto_timer:stop() else auto_timer = vim.loop.new_timer() end
  auto_timer:start(120, 0, vim.schedule_wrap(function()
    if vim.fn.mode() ~= "i" then return end
    local w = word_before()
    if not w or #w < 2 then return end
    local items = candidates(w)
    if #items == 0 or (#items == 1 and items[1].word == w) then return end
    vim.fn.complete(vim.api.nvim_win_get_cursor(0)[2] - #w + 1, items)
  end))
end

function M.tab()
  local w = word_before()
  local pick
  if w and snippets[w] and allowed(snippets[w]) then pick = w
  elseif w and vim.fn.pumvisible() == 1 then
    local items = candidates(w)
    local sel = vim.fn.complete_info({ "selected" }).selected
    if #items > 0 then pick = items[(sel >= 0 and items[sel + 1]) and sel + 1 or 1].word end
  end
  if pick then
    local col = vim.api.nvim_win_get_cursor(0)[2]
    local row = vim.api.nvim_win_get_cursor(0)[1]
    vim.api.nvim_buf_set_text(0, row - 1, col - #w, row - 1, col, { "" })
    vim.api.nvim_win_set_cursor(0, { row, col - #w })
    M.expand(snippets[pick].body)
    return
  end
  if in_session() and session.cur < #session.marks then goto_stop(session.cur + 1); return end
  vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes("<Tab>", true, false, true), "n", false)
end

function M.jump(dir)
  if not in_session() then return false end
  local nxt = session.cur + dir
  if nxt < 1 or nxt > #session.marks then return false end
  goto_stop(nxt)
  return true
end

function M.expand_named(n) if snippets[n] then M.expand(snippets[n].body) end end

M.load()
return M

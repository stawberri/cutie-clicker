state = \start
var state-interval

$html = $ 'html'
$save-data = $ '#save-data'
$load-data = $ '#load-data'
$load-cancel = $ '#load-cancel'
$load-go = $ '#load-go'

if location.protocol + location.host != 'https:cc.aideen.pw'
  $html.add-class 'http'

set-state = (new-state) ->
  clear-interval state-interval if state-interval?

  $html.remove-class state .add-class newState
  state := new-state

save-data-select = ->
  $save-data
    ..focus!
    ..select!

generate-save-data = ->
  data = LZString.compress-to-base64 JSON.stringify local-storage

  date = new Date!

  value = """
    Cutie Clicker Game Data
    Saved: #date
    [0|#data]
  """
  $save-data
    ..val value
    ..data 'data' data

find-data-string = ->
  # http://stackoverflow.com/questions/475074/regex-to-parse-or-validate-base64-data
  it == //\[0\|([a-zA-Z0-9+/=]+)\]//

$ '#button-save' .on 'click' ->
  if state == \save
    set-state \start
  else

    generate-save-data!

    set-state \save

    save-data-select!

$save-data
  ..on 'click' save-data-select
  ..on 'input' ->
    unless (data = find-data-string $save-data.val!) and data.1 == $save-data.data 'data'
      generate-save-data!
      save-data-select!


load-data-reset = ->
  $load-data
    ..val ''
    ..remove-class 'ok'
    ..focus!

$ '#button-load' .on 'click' ->
  if state == 'load'
    set-state \start
  else
    set-state 'load'

    load-data-reset!

load-data-ok = ->
  $load-data.has-class 'ok'

$load-data .on 'input' ->
  if find-data-string $load-data.val!
    try
      data = JSON.parse LZString.decompress-from-base64 that.1

  if data?
    $load-data
      ..add-class 'ok'
      ..data 'data' data
  else
    $load-data
      ..remove-class 'ok'
      ..remove-data 'data'

$load-cancel .on 'click' ->
  return unless load-data-ok

  load-data-reset!

$load-go .on 'click' ->
  return unless load-data-ok

  data = $load-data.data 'data'
  return unless data?

  $html.add-class 'processing'

  local-storage.clear!

  try
    for key, value of data
      local-storage.set-item key, value

    window.location = '/'
  catch err
    $ '#processing'
      ..css 'font-size' '1.2rem'
      ..text err

$ '#button-back' .on 'click' ->
  window.location = '/'

$ '#button-https' .on 'click' ->
  window.location = 'https://cc.aideen.pw/data/'

$ '#delete-local-storage' .on 'click' ->
  it.preventDefault!

  if confirm 'If you haven\'t saved your game data yet, you will lose it! Are you sure you want to delete your http data?'
    local-storage.clear!

    window.location = 'https://cc.aideen.pw/'

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

$ '#button-save' .on 'click' ->
  if state == \save
    set-state \start
  else
    generate-save-data = (force) ->
      return if not force and $save-data.is ':focus'

      storage = LZString.compress-to-base64 JSON.stringify local-storage

      date = new Date!

      storage = """
        Cutie Clicker Game Data
        Saved: #date
        [0|#storage]
      """
      $save-data.val storage

    generate-save-data true

    set-state \save

    save-data-select!

    state-interval = set-interval generate-save-data, 10000

$save-data .on 'click' save-data-select

load-data-reset = ->
  $load-data
    ..val ''
    ..remove-class 'ok'
    ..prop 'readonly' false
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
  $this = $ @

  # http://stackoverflow.com/questions/475074/regex-to-parse-or-validate-base64-data
  if $this.val! == //
    \[0\|((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)\]
  //
    try
      data = JSON.parse LZString.decompress-from-base64 that.1

  if data? and not $.is-empty-object data
    $this
      ..prop 'readonly' true
      ..add-class 'ok'
      ..val ..val!

    $this.data 'data' data

$load-cancel .on 'click' ->
  return unless load-data-ok

  load-data-reset!

$load-go .on 'click' ->
  return unless load-data-ok

  data = $load-data.data 'data'
  return unless data? and not $.is-empty-object data

  local-storage.clear!

  for key, value of data
    local-storage.set-item key, value

  window.location = '/'

$ '#button-back' .on 'click' ->
  window.location = '/'

$ '#button-https' .on 'click' ->
  window.location = 'https://cc.aideen.pw/data'

$ '#delete-local-storage' .on 'click' ->
  it.preventDefault!

  if confirm 'If you haven\'t saved your game data yet, you will lose it! Are you sure you want to delete your http data?'
    local-storage.clear!

    window.location = 'https://cc.aideen.pw/'

<script lang="ts">
  function splitWindowClick() {
    alert('split Window')
  }

  function closeWindowClick() {
    alert('close Window')
  }
</script>

<div class="panel-topbar">
  <div>Topbar</div>
  <div class="button-wrap">
    <button on:click={splitWindowClick}>+</button>
    <button on:click={closeWindowClick}>-</button>
  </div>
</div>

<style>
  .panel-topbar {
    display: flex;
    justify-content: space-between;
    background: rgb(194, 194, 194);
    padding: 4px 8px;
  }
  .panel-topbar .button-wrap {
    display: flex;
    gap: 4px;
  }
  .panel-topbar .button-wrap button {
    font-size: 20px;
    background: rgb(194, 194, 194);
  }
  .panel-topbar .button-wrap button:hover {
    background: rgb(110, 110, 110);
  }
</style>

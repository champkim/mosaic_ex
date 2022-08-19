<script lang="ts">
  const onClickGithub = () => {
    window.open("https://github.com/champkim/mosaic_ex", "_blank");
  };
</script>

<div class="top-bar">
  <div class="title">mosaic-ex</div>
  <div class="button-wrap">
    <button on:click>Auto Arrage</button>
    <button>Add Window to Top Right</button>
    <div on:click={onClickGithub} class="git-hub-logo" />
  </div>
</div>

<style>
  .top-bar {
    color: #fefefe;
    background: #373e44;
    font-weight: bold;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    padding: 4px 8px;
    display: flex;
    justify-content: space-between;
  }
  .top-bar .button-wrap {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .top-bar .button-wrap button {
    height: 30px;
  }
  .git-hub-logo {
    display: inline-block;
    width: 40px;
    height: 40px;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url(https://cdn-icons-png.flaticon.com/512/25/25231.png);
    cursor: pointer;
  }
</style>

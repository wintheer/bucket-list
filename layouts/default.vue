<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-brand to="/">bucket-list</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="mx-auto">
          <b-nav-item class="pr-3" to="/inspiration">Inspiration</b-nav-item>
          <b-nav-item class="pr-3" to="/partners">Partners</b-nav-item>
          <b-nav-item to="/community">Community</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav>
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search..."></b-form-input>
          </b-nav-form>

          <b-nav-item-dd text="User" right>
            <template slot="button-content"><b-avatar/></template>
            <b-dropdown-item to="#">Profile</b-dropdown-item>
            <b-dropdown-item to="#">Sign Out</b-dropdown-item>
          </b-nav-item-dd>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <Nuxt />
  </div>
</template>

<style>
/* Freddy's custom colour palette: https://coolors.co/0d1f22-6290c3-edf7f6-98473e-a37c40 */

:root {
  --jungle-green: #0D1F22;
  --un-blue: #6290C3;
  --txt-colour: #EDF7F6;
  --chestnut: #98473E;
  --sunburst: #A37C40;

  /* Colour blind colours -- PROTANOPIA */
  --jungle-green--cb: #141421;
  --un-blue--cb: #7576B6;
  --txt-colour--cb: #F1F1F6;
  --chestnut--cb: #747440;
  --sunburst--cb: #92914E;
}

.navbar.navbar-dark.bg-dark{
    background-color: --var(jungle-green)!important;
 }

 .nav-link {
   font-size: 1.1rem;
 }

</style>

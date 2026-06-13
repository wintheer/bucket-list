<template>
  <div>
    <BNavbar toggleable="md" variant="dark" class="navbar-dark bg-dark">
      <BNavbarBrand to="/">bucket-list</BNavbarBrand>
      <BNavbarToggle target="nav-collapse" />
      <BCollapse id="nav-collapse" is-nav>
        <BNavbarNav class="mx-auto">
          <BNavItem class="pr-2" to="/inspiration">Inspiration</BNavItem>
          <BNavItem class="pr-2" to="/partners">Partners</BNavItem>
          <BNavItem class="pr-2" to="/community">Community</BNavItem>
          <BNavItem to="/about">About</BNavItem>
        </BNavbarNav>
        <BNavbarNav>
          <BNavForm>
            <BFormInput size="sm" class="mr-sm-2" placeholder="Search..." />
          </BNavForm>
          <BNavItemDropdown text="User" right>
            <template #button-content><BAvatar /></template>
            <BDropdownItem to="#">Profile</BDropdownItem>
            <BDropdownItem to="#">Sign Out</BDropdownItem>
          </BNavItemDropdown>
        </BNavbarNav>
      </BCollapse>
    </BNavbar>
    <NuxtPage />
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

 .navbar.navbar-dark.bg-dark.navbar-expand-md {
   padding-top: 0 !important;
   padding-bottom: 0 !important;
 }

</style>

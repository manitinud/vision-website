document.addEventListener('DOMContentLoaded', function () {
  const menuButton = document.getElementById('menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOpenIcon = document.getElementById('menu-open-icon');
  const menuCloseIcon = document.getElementById('menu-close-icon');
  const webinarDropdownButton = document.getElementById('webinar-dropdown-button');
  const webinarDropdownMenu = document.getElementById('webinar-dropdown-menu');
  const webinarDropdownArrow = webinarDropdownButton.querySelector('.dropdown-arrow');
  const mobileWebinarDropdownButton = document.getElementById('mobile-webinar-dropdown-button');
  const mobileWebinarDropdownMenu = document.getElementById('mobile-webinar-dropdown-menu');
  const mobileWebinarDropdownArrow = mobileWebinarDropdownButton.querySelector('.dropdown-arrow');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  
  function closeAllMenus() {
      mobileMenu.classList.remove('open');
      menuOpenIcon.classList.remove('hidden');
      menuCloseIcon.classList.add('hidden');
      webinarDropdownMenu.classList.add('hidden');
      webinarDropdownArrow.classList.remove('open');
      mobileWebinarDropdownMenu.classList.add('hidden');
      mobileWebinarDropdownArrow.classList.remove('open');
  }

  menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    menuOpenIcon.classList.toggle('hidden');
    menuCloseIcon.classList.toggle('hidden');
  });
  
  mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
          setTimeout(closeAllMenus, 150);
      });
  });

  webinarDropdownButton.addEventListener('click', (event) => {
    event.stopPropagation();
    webinarDropdownMenu.classList.toggle('hidden');
    webinarDropdownArrow.classList.toggle('open');
  });

  mobileWebinarDropdownButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    mobileWebinarDropdownMenu.classList.toggle('hidden');
    mobileWebinarDropdownArrow.classList.toggle('open');
  });

  document.addEventListener('click', (event) => {
    if (webinarDropdownButton && !webinarDropdownButton.contains(event.target) && !webinarDropdownMenu.contains(event.target)) {
      webinarDropdownMenu.classList.add('hidden');
      webinarDropdownArrow.classList.remove('open');
    }
  });

  const moduleTabs = document.querySelectorAll('.module-tab');
  const moduleContents = document.querySelectorAll('.module-content');
  let activeModuleIndex = 0;
  const modulesData = [
    { color: "from-emerald-500 to-teal-600" }, { color: "from-blue-500 to-indigo-600" },
    { color: "from-purple-500 to-violet-600" }, { color: "from-orange-500 to-red-500" },
    { color: "from-pink-500 to-rose-600" }
  ];

  function setActiveModule(index) {
    if (!moduleTabs.length || !moduleContents.length) return;
    moduleTabs.forEach((tab, i) => {
      tab.classList.remove('bg-gradient-to-r', ...modulesData.flatMap(m => m.color.split(' ')), 'text-white', 'shadow-xl', 'scale-105');
      tab.classList.add('bg-white', 'hover:bg-gray-50', 'text-gray-700', 'shadow-md', 'border', 'border-gray-200');
      const iconContainer = tab.querySelector('.p-2'), icon = tab.querySelector('.w-8');
      if (iconContainer && icon) {
        iconContainer.classList.add('bg-gray-100'); icon.classList.add('text-gray-600');
        iconContainer.classList.remove('bg-white/20'); icon.classList.remove('text-white');
      }
      moduleContents[i].classList.remove('active');
    });
    const activeTab = moduleTabs[index], activeColor = modulesData[index].color.split(' ');
    activeTab.classList.add('bg-gradient-to-r', activeColor[0], activeColor[1], 'text-white', 'shadow-xl', 'scale-105');
    activeTab.classList.remove('bg-white', 'hover:bg-gray-50', 'text-gray-700', 'shadow-md', 'border', 'border-gray-200');
    const activeIconContainer = activeTab.querySelector('.p-2'), activeIcon = activeTab.querySelector('.w-8');
    if(activeIconContainer && activeIcon) {
        activeIconContainer.classList.add('bg-white/20'); activeIcon.classList.add('text-white');
        activeIconContainer.classList.remove('bg-gray-100'); activeIcon.classList.remove('text-gray-600');
    }
    moduleContents[index].classList.add('active');
    activeModuleIndex = index;
  }
  moduleTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      setActiveModule(index);
      clearInterval(moduleInterval);
      moduleInterval = setInterval(autoSwitchModule, 4000);
    });
  });
  function autoSwitchModule() {
    if (!modulesData.length) return;
    const nextIndex = (activeModuleIndex + 1) % modulesData.length;
    setActiveModule(nextIndex);
  }
  if (moduleTabs.length > 0) {
    var moduleInterval = setInterval(autoSwitchModule, 4000);
  }
});
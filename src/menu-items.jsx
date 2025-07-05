const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/default'
        },
        {
          id: 'users',
          title: 'Users',
          type: 'item',
          icon: 'feather icon-user',
          url: '/app/dashboard/users'
        },
        {
          id: 'news',
          title: 'News',
          type: 'item',
          icon: 'feather icon-plus',
          url: '/app/dashboard/news'
        },
        {
          id: 'artical',
          title: 'Artical',
          type: 'item',
          icon: 'feather icon-tag',
          url: '/app/dashboard/artical'
        },
        {
          id: 'service',
          title: 'Service',
          type: 'item',
          icon: 'feather icon-volume',
          url: '/app/dashboard/service'
        },
        {
          id: 'exchange',
          title: 'Exchange',
          type: 'item',
          icon: 'feather icon-star',
          url: '/app/dashboard/exchange'
        },
        {
          id: 'call-center-agents',
          title: 'Call Center Agents',
          type: 'item',
          icon: 'feather icon-user-check',
          url: '/app/dashboard/call-center-agents'
        },
        {
          id: 'call-center-users',
          title: 'Call Center Users',
          type: 'item',
          icon: 'feather icon-user-check',
          url: '/app/dashboard/call-center-users'
        },
        {
          id: 'logout',
          title: 'Logout',
          type: 'item',
          icon: 'feather icon-user-check',
          url: '/app/dashboard/logout'
        }
      ]
    }
  ]
};

export default menuItems;

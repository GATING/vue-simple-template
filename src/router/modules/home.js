const router = [
  {
    path: "/home",
    meta: {
      sort: 0,
      icon: "el-icon-s-home",
      title: "首页",
    },
    component: () => import("@view/home.vue"),
  },
  {
    path: "/home2",
    meta: {
      sort: 0,
      icon: "el-icon-s-home",
      title: "首页2",
    },
    children: [
      {
        path: "/home2/index",
        meta: {
          sort: 0,
          icon: "el-icon-s-home",
          title: "首页2",
        },
      },
    ],
    component: () => import("@/layout/BlackLayout.vue"),
  },
];

export default router;

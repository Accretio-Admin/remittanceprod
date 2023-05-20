const allRoles = {
  initialsuperadmin: ["getUsers", "manageUsers", "manageLandbankCredentials", "manageConfig"],
  superadmin: ["getUsers", "manageUsers", "manageLandbankCredentials", "manageConfig"],
  admin: ["getUsers", "manageUsers", "manageLandbankCredentials", "manageConfig"],
  companyadmin: ["getUsers", "manageUsers"],
  agent: [],
};

const accessLevel = {
  initialsuperadmin: [
    { role: "superadmin" },
    { role: "admin" },
    { role: "companyadmin" },
    { role: "agent" },
  ],
  superadmin: [
    { role: "superadmin" },
    { role: "admin" },
    { role: "companyadmin" },
    { role: "agent" },
  ],
  admin: [{ role: "companyadmin" }, { role: "agent" }],
  companyadmin: [{ role: "agent" }],
};
const dashboardAccessLevels = {
  initialsuperadmin: {
    projects: ["remittance", "bayad center"],
    users: {
      main: true,
      listing: {
        assignee: true,
        lock: true,
        edit: {
          main: true,
          name: true,
          email: true,
          lock: true,
          password: true,
          role: true,
          password: true,
          credentialAssignment: true,
          ipAssignment: true,
        },
        add: {
          main: true,
          role: false,
        },
      },
    },
    transactions: {
      main: true,
      listing: {
        cashPickup: true,
        remittance: true
      }
    },
    rateLimiter: {
      main: true,
      listing: {
        delete: {
          main: true,
        },
        add: {
          main: true,
        },
      },
    },
    configs: {
      main: true,
    },
    smspanel: {
      main: true,
    },
    logs: {
      main: true,
    },
  },
  superadmin: {
    projects: ["remittance", "bayad center"],
    users: {
      main: true,
      listing: {
        assignee: true,
        lock: true,
        edit: {
          main: true,
          name: true,
          email: true,
          lock: true,
          password: true,
          role: true,
          password: true,
          credentialAssignment: true,
          ipAssignment: true,
        },
        add: {
          main: true,
          role: false,
        },
      },
    },
    transactions: {
      main: true,
      listing: {
        cashPickup: true,
        remittance: true
      }
    },
    rateLimiter: {
      main: true,
      listing: {
        delete: {
          main: true,
        },
        add: {
          main: true,
        },
      },
    },
    configs: {
      main: true,
    },
    smspanel: {
      main: true,
    },
    logs: {
      main: true,
    },
  },
  admin: {
    projects: ["remittance", "bayad center"],
    users: {
      main: true,
      listing: {
        assignee: true,
        lock: true,
        edit: {
          main: true,
          name: true,
          email: true,
          lock: true,
          password: true,
          role: true,
          password: true,
          credentialAssignment: true,
          ipAssignment: true,
        },
        add: {
          main: true,
          role: false,
        },
      },
    },
    transactions: {
      main: true,
      listing: {
        cashPickup: true,
        remittance: true
      }
    },
    rateLimiter: {
      main: false,
      listing: {
        delete: {
          main: true,
        },
        add: {
          main: true,
        },
      },
    },
    configs: {
      main: true,
    },
    smspanel: {
      main: false,
    },
    logs: {
      main: false,
    },
  },
  companyadmin: {
    projects: ["remittance", "bayad center"],
    users: {
      main: true,
      listing: {
        assignee: true,
        lock: true,
        edit: {
          main: true,
          name: true,
          email: true,
          lock: true,
          password: true,
          role: true,
          password: true,
          credentialAssignment: false,
          ipAssignment: true,
        },
        add: {
          main: true,
          role: false,
        },
      },
    },
    transactions: {
      main: true,
      listing: {
        cashPickup: true,
        remittance: true
      }
    },
    rateLimiter: {
      main: false,
      listing: {
        delete: {
          main: true,
        },
        add: {
          main: true,
        },
      },
    },
    configs: {
      main: false,
    },
    smspanel: {
      main: false,
    },
    logs: {
      main: false,
    },
  },
};
const activeEndpoints = [
  "/v1/landbank/account/remittance",
  "/v1/bayadcenter",
  "/v1/ubx",
  
]
const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));
const dashboardAl = new Map(Object.entries(dashboardAccessLevels));


module.exports = {
  roles,
  roleRights,
  accessLevel,
  dashboardAl,
  activeEndpoints
};

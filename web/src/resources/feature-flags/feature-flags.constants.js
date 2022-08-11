export const featureTemplate = {
  _id: '',
  name: '',
  description: '',
  enabled: false,
  enabledForEveryone: false,
  users: [],
  usersPercentage: 0,
  tests: [],
  createdOn: new Date().toISOString(),
};

export const listResponse = {
  items: [
      {
        _id: '62eacd2aae77c8534d742939',
        name: 'RedesignedVideoPlayer',
        description: '',
        enabled: true,
        enabledForEveryone: true,
        users: [
          'john.locke@gmail.com',
          'rene.descartes@gmail.com',
          'jim.jarmusch@movie.com',
          'silent.hill@movie.com',
          'walter.white@movie.com',
          'james.bond@movie.com',
          'Im.batman@movie.com',
          'Im.batman2@movie.com',
          'lars.von.trier@movie.com',
          'ridley.scott@movie.com',
          'alien@movie.com',
          'prometeus@movie.com',
          'blade.runner@movie.com',
        ],
        usersPercentage: 20,
        tests: [
          {
            _id: '123412341234',
            name: 'Variant A',
            configuration: "{\n \"buttonColor\": \"red\",\n \"defaultSound\": \"unmuted\"\n,\n \"fontSize\": \"md\"\n}",
          },
          {
            _id: '12341234576456',
            name: 'Variant B',
            configuration: "{\n \"buttonColor\": \"blue\",\n \"defaultSound\": \"muted\"\n,\n \"fontSize\": \"sm\"\n}",
          },
        ],
        createdOn: '2022-08-23 19:31:54.572Z',
      },
      {
        _id: '62eacd2aae77c8534d742940',
        name: 'EmailChange',
        description: 'The ability for users to change email (With confirmation of new email)',
        enabled: false,
        enabledForEveryone: false,
        users: [
          'john.locke@gmail.com',
        ],
        usersPercentage: 0,
        tests: [],
        createdOn: '2022-07-23 19:31:54.572Z',
      },
      {
        _id: '62eacd2aae77c8534d742941',
        name: 'NotificationBar',
        description: 'We need to check on real users to see if we are sending too many useless notifications in the new notification bar',
        enabled: false,
        enabledForEveryone: false,
        users: [],
        usersPercentage: 50,
        tests: [],
        createdOn: '2022-07-20 19:31:54.572Z',
      },
      {
        _id: '62eacd2aae77c8534d742942',
        name: 'SecurityEmailNotifications',
        description: 'Send an email to the user if a login is detected from a new device or if more than 3 unsuccessful login attempts are made',
        enabled: true,
        enabledForEveryone: true,
        users: [],
        usersPercentage: 0,
        tests: [],
        createdOn: '2022-07-03 19:31:54.572Z',
      },
      {
        _id: '62eacd2aae77c8534d742943',
        name: 'DarkMode',
        description: 'The ability for users to change the theme of the site to Dark',
        enabled: true,
        enabledForEveryone: true,
        users: [],
        usersPercentage: 0,
        tests: [],
        createdOn: '2022-06-03 19:31:54.572Z',
      },
  ],
  totalPages: 1,
  count: 8,
};
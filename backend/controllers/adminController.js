const competitionService = require('../services/competition')
const goalService = require('../services/goal')
const userService = require('../services/user')
const requestService = require('../services/request')
const moment = require('moment')
const bcrypt = require('bcryptjs')

//add company
//seven goals
//three competitions
//three requests
//one user
exports.addCompany = async (req, res) => {
  try {
    const { firstName, lastName, alias, email, password } = req.body

    //#region REGISTER USER

    //check if email already used
    const checkUser = await userService.getUserByEmail(email)
    if (checkUser)
      return res
        .status(400)
        .json({ msg: 'Account already exists for this email address.' })

    //populate user fields
    const userFields = {
      firstName,
      lastName,
      alias,
      email,
      password,
    }

    userFields.searchable = false

    //create salt and hash password
    const salt = await bcrypt.genSalt(10)
    userFields.password = await bcrypt.hash(password, salt)

    //add user
    const user = await userService.addNewUser(userFields)

    //#endregion

    //#region ADD FRIENDS

    await userService.addFriendToUser(user.id, '5e308cb47f80821509520d0e')

    await userService.addFriendToUser('5e308cb47f80821509520d0e', user.id)

    await userService.addFriendToUser(user.id, '5e308cd07f80821509520d0f')

    await userService.addFriendToUser('5e308cd07f80821509520d0f', user.id)

    await userService.addFriendToUser(user.id, '5e30d672e98c4840b52e5a7f')

    await userService.addFriendToUser('5e30d672e98c4840b52e5a7f', user.id)

    //#endregion

    //#region CREATE REQUESTS

    let requestFields

    requestFields = {
      requester: user.id,
      requestee: '5e3e4edfe033781c1ca5e8b4',
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }

    await requestService.addNewRequest(requestFields)

    requestFields = {
      requester: '5e62abef8a9020046aff4a98',
      requestee: user.id,
      firstName: 'Golf',
      lastName: 'Hotel',
      email: 'golf@golf.com',
    }

    await requestService.addNewRequest(requestFields)

    requestFields = {
      requester: '5e3842aa4a637715999fdd3b',
      requestee: user.id,
      firstName: 'Echo',
      lastName: 'Foxtrot',
      email: 'echo@echo.com',
    }

    await requestService.addNewRequest(requestFields)

    //#endregion

    //#region CREATE GOALS
    let goalFields

    //Pass/fail goal
    goalFields = {
      user: user._id,
      name: 'Pass/Fail Goal (start here)',
      duration: 91,
      startDate: moment().subtract(51, 'days'),
      type: 'pass/fail',
      description:
        'This is a pass/fail goal. Goals are set by individual users who are looking to keep track of their progress. Here, users can click on days to determine whether or not they achieved their goal (e.g. go to the gym) on a given day. Goals can be deleted or modified (although this goal has already begun, so some attributes cannot be changed).',
      units: '',
      total: 7,
      isPrivate: false,
      tracker: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    }

    await goalService.addNewGoal(goalFields)

    //Difference goal
    goalFields = {
      user: user._id,
      name: 'Difference Goal',
      duration: 90,
      startDate: moment().subtract(48, 'days'),
      type: 'difference',
      description:
        "This is a difference goal. Users put in a starting value (e.g. 165 lbs) and a number they'd like to get to (e.g. 175 lbs). This number can be negative or positive.",
      units: 'lbs',
      total: 175,
      isPrivate: false,
      tracker: [
        165,
        null,
        null,
        null,
        null,
        null,
        163,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        172,
        null,
        null,
        null,
        null,
        null,
        171,
        170,
        null,
        null,
        null,
        168,
        null,
        null,
        null,
        null,
        170,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        172,
        null,
        null,
        null,
        null,
        166,
        null,
        null,
        null,
        null,
        168,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    }

    await goalService.addNewGoal(goalFields)

    //Total goal
    goalFields = {
      user: user._id,
      name: 'Total Goal',
      duration: 90,
      startDate: moment().subtract(48, 'days'),
      type: 'total',
      description:
        "This is a total goal. Users input how much of something they'd like to do (e.g. 'Run 100 miles') and can record their daily totals.",
      units: 'miles',
      total: 175,
      isPrivate: false,
      tracker: [
        3,
        4,
        0,
        6,
        2,
        1,
        4,
        3,
        3,
        3,
        1,
        0,
        4,
        0,
        3,
        5,
        0,
        1,
        1,
        2,
        0,
        2,
        0,
        0,
        3,
        0,
        0,
        0,
        0,
        6,
        2,
        0,
        1,
        3,
        0,
        0,
        2,
        3,
        0,
        0,
        0,
        4,
        3,
        0,
        0,
        0,
        2,
        2,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
    }

    await goalService.addNewGoal(goalFields)

    //Future goal
    goalFields = {
      user: user._id,
      name: 'Future Goal',
      duration: 90,
      startDate: moment().add(30, 'days'),
      type: 'total',
      description:
        'This is a goal that has not yet begun. Anything about it can be changed before it starts.',
      units: 'miles',
      total: 100,
      isPrivate: false,
      tracker: [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
    }

    await goalService.addNewGoal(goalFields)

    //Past difference
    goalFields = {
      user: user._id,
      name: 'Past Difference',
      duration: 28,
      startDate: moment().subtract(150, 'days'),
      type: 'difference',
      description:
        'This is a goal that has not yet begun. Anything about it can be changed before it starts.',
      units: 'lbs',
      total: 165,
      isPrivate: false,
      tracker: [
        155,
        null,
        null,
        null,
        null,
        null,
        null,
        157,
        null,
        null,
        null,
        null,
        null,
        null,
        162,
        null,
        null,
        null,
        null,
        null,
        null,
        161,
        null,
        null,
        164,
        null,
        null,
        166,
        165,
      ],
    }

    await goalService.addNewGoal(goalFields)

    //Past pass/fail
    goalFields = {
      user: user._id,
      name: 'Past Pass/Fail',
      duration: 28,
      startDate: moment().subtract(150, 'days'),
      type: 'pass/fail',
      description:
        'This is a goal that has not yet begun. Anything about it can be changed before it starts.',
      units: '',
      total: 7,
      isPrivate: false,
      tracker: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
    }

    await goalService.addNewGoal(goalFields)

    //Past total
    goalFields = {
      user: user._id,
      name: 'Past Total',
      duration: 28,
      startDate: moment().subtract(150, 'days'),
      type: 'total',
      description:
        'This is a goal that has not yet begun. Anything about it can be changed before it starts.',
      units: 'miles',
      total: 100,
      isPrivate: false,
      tracker: [
        4,
        4,
        4,
        4,
        4,
        0,
        6,
        4,
        3,
        4,
        4,
        4,
        3,
        4,
        0,
        7,
        4,
        3,
        4,
        3,
        4,
        4,
        3,
        4,
        3,
        4,
        4,
        4,
      ],
    }

    await goalService.addNewGoal(goalFields)

    //#endregion

    //#region CREATE COMPETITIONS

    let goal, compFields, competition

    //#region TOTAL competition
    //create competition goal
    goalFields = {
      user: '5e308cb47f80821509520d0e',
      name: 'Total Competition',
      duration: 70,
      startDate: moment().subtract(30, 'days'),
      type: 'total',
      description:
        "Try to run the most miles! This is a competition between you, Alpha, and Bravo, and you're in the lead! Competitions work like goals but are shared between users. You are an admin, so you can invite users (if a competition hasn't started), ask users to be admins, kick users, and modify or delete the competition.",
      units: 'miles',
      total: 7,
      isPrivate: true,
      tracker: [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
    }

    goal = await goalService.addNewGoal(goalFields)

    //create competition
    compFields = {
      goalId: goal._id,
      userIds: [
        user.id,
        '5e308cb47f80821509520d0e',
        '5e308cd07f80821509520d0f',
      ],
      adminIds: [user.id],
    }

    competition = await competitionService.addNewCompetition(compFields)

    //modify user goal to include compId
    goal = await goalService.updateGoalById(goal._id, {
      user: competition._id,
    })

    //create user goal
    goalFields = {
      user: user._id,
      compId: competition._id,
      name: 'Total Competition',
      duration: 70,
      startDate: moment().subtract(30, 'days'),
      type: 'total',
      description:
        "Try to run the most miles! This is a competition between you, Alpha, and Bravo, and you're in the lead! Competitions work like goals but are shared between users. You are an admin, so you can invite users (if a competition hasn't started), ask users to be admins, kick users, and modify or delete the competition.",
      units: 'miles',
      total: 7,
      isPrivate: true,
      tracker: [
        3,
        4,
        2,
        1,
        4,
        0,
        0,
        3,
        2,
        0,
        4,
        0,
        3,
        2,
        0,
        0,
        3,
        5,
        3,
        2,
        3,
        0,
        0,
        3,
        4,
        2,
        0,
        0,
        2,
        2,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
    }

    await goalService.addNewGoal(goalFields)

    //create competitor goals
    goalFields = {
      user: '5e308cb47f80821509520d0e',
      compId: competition._id,
      name: 'Total Competition',
      duration: 70,
      startDate: moment().subtract(30, 'days'),
      type: 'total',
      description:
        "Try to run the most miles! This is a competition between you, Alpha, and Bravo, and you're in the lead! Competitions work like goals but are shared between users. You are an admin, so you can invite users (if a competition hasn't started), ask users to be admins, kick users, and modify or delete the competition.",
      units: 'miles',
      total: 7,
      isPrivate: true,
      tracker: [
        1,
        1,
        0,
        0,
        0,
        1,
        2,
        0,
        0,
        3,
        5,
        4,
        6,
        4,
        2,
        3,
        2,
        2,
        1,
        0,
        4,
        1,
        0,
        2,
        2,
        0,
        0,
        0,
        2,
        3,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
    }

    goal = await goalService.addNewGoal(goalFields)

    goalFields = {
      user: '5e308cd07f80821509520d0f',
      compId: competition._id,
      name: 'Total Competition',
      duration: 70,
      startDate: moment().subtract(30, 'days'),
      type: 'total',
      description:
        "Try to run the most miles! This is a competition between you, Alpha, and Bravo, and you're in the lead! Competitions work like goals but are shared between users. You are an admin, so you can invite users (if a competition hasn't started), ask users to be admins, kick users, and modify or delete the competition.",
      units: 'miles',
      total: 7,
      isPrivate: true,
      tracker: [
        0,
        2,
        0,
        3,
        2,
        0,
        0,
        2,
        0,
        0,
        0,
        1,
        0,
        2,
        0,
        0,
        0,
        1,
        1,
        1,
        0,
        0,
        0,
        2,
        0,
        0,
        0,
        0,
        1,
        2,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
    }

    goal = await goalService.addNewGoal(goalFields)

    //#endregion

    //#region DIFFERENCE competition

    //create competition goal
    goalFields = {
      user: '5e308cb47f80821509520d0e',
      name: 'Difference Competition',
      duration: 90,
      startDate: moment().subtract(23, 'days'),
      type: 'difference',
      description:
        'In this competition, users are trying to put on the most (good) weight. ',
      units: 'lbs',
      total: 7,
      isPrivate: true,
      tracker: [
        100,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    }

    goal = await goalService.addNewGoal(goalFields)

    //create competition
    compFields = {
      goalId: goal._id,
      userIds: [
        user.id,
        '5e308cb47f80821509520d0e',
        '5e308cd07f80821509520d0f',
      ],
      adminIds: [user.id],
    }

    competition = await competitionService.addNewCompetition(compFields)

    //modify goal to include competition id
    goal = await goalService.updateGoalById(goal._id, {
      user: competition._id,
    })

    await goalService.addNewGoal(goalFields)

    //create user goal
    goalFields = {
      user: user._id,
      compId: competition._id,
      name: 'Difference Competition',
      duration: 90,
      startDate: moment().subtract(23, 'days'),
      type: 'difference',
      description:
        'In this competition, users are trying to put on the most (good) weight. ',
      units: 'lbs',
      total: 7,
      isPrivate: true,
      tracker: [
        130,
        null,
        132,
        null,
        null,
        135,
        133,
        136,
        null,
        null,
        134,
        null,
        null,
        135,
        null,
        null,
        null,
        null,
        139,
        null,
        null,
        null,
        null,
        140,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    }

    await goalService.addNewGoal(goalFields)

    //create competitor goals
    goalFields = {
      user: '5e308cb47f80821509520d0e',
      compId: competition._id,
      name: 'Difference Competition',
      duration: 90,
      startDate: moment().subtract(23, 'days'),
      type: 'difference',
      description:
        'In this competition, users are trying to put on the most (good) weight. ',
      units: 'lbs',
      total: 7,
      isPrivate: true,
      tracker: [
        165,
        null,
        null,
        null,
        null,
        null,
        null,
        167,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        167,
        null,
        null,
        168,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    }

    goal = await goalService.addNewGoal(goalFields)

    goalFields = {
      user: '5e308cd07f80821509520d0f',
      compId: competition._id,
      name: 'Difference Competition',
      duration: 90,
      startDate: moment().subtract(23, 'days'),
      type: 'difference',
      description:
        'In this competition, users are trying to put on the most (good) weight. ',
      units: 'lbs',
      total: 7,
      isPrivate: true,
      tracker: [
        100,
        null,
        null,
        97,
        null,
        null,
        null,
        98,
        null,
        101,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        104,
        null,
        null,
        null,
        109,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    }

    goal = await goalService.addNewGoal(goalFields)

    //#endregion

    //#region FUTURE competition

    //create user goal
    goalFields = {
      user: user._id,
      name: 'Future Pass/Fail Competition',
      duration: 28,
      startDate: moment().add(30, 'days'),
      type: 'pass/fail',
      description:
        'This competition has not yet begun. Pass/fail competitions are currently under construction but will look similar to pass/fail goals.',
      units: '',
      total: 7,
      isPrivate: true,
      tracker: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    }

    goal = await goalService.addNewGoal(goalFields)

    //create competition
    compFields = {
      goalId: goal._id,
      userIds: [user.id],
      adminIds: [user.id],
    }

    competition = await competitionService.addNewCompetition(compFields)

    //modify user goal to include compId
    goal = await goalService.updateGoalById(goal._id, {
      compId: competition._id,
    })

    //create competition goal
    goalFields = {
      user: competition._id,
      name: 'Future Pass/Fail Competition',
      duration: 28,
      startDate: moment().add(30, 'days'),
      type: 'pass/fail',
      description:
        'This competition has not yet begun. Pass/fail competitions are currently under construction but will look similar to pass/fail goals.',
      units: '',
      total: 7,
      isPrivate: true,
      tracker: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    }

    await goalService.addNewGoal(goalFields)

    //#endregion

    //#endregion

    res.json({ user })
  } catch (err) {
    console.log(err)

    res.status(500).json({ msg: 'Server error' })
  }
}

//add week to all dates
exports.addWeek = async (req, res) => {
  try {
    let goals = await goalService.getAllGoals()
    //update goals
    goals.map(async (goal) => {
      try {
        let date = moment(goal.startDate).add(7, 'days')
        await goalService.updateGoalById(goal._id, { startDate: date })
      } catch (err) {
        console.log(err)
      }
    })
    res.json(goals)
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: 'Server error' })
  }
}

//subtract week from all dates
exports.subtractWeek = async (req, res) => {
  try {
    let goals = await goalService.getAllGoals()
    //update goals
    // goals.map(async (goal) => {
    //   try {
    //     let date = moment(goal.startDate).subtract(7, 'days')
    //     await goalService.updateGoalById(goal._id, { startDate: date })
    //   } catch (err) {
    //     console.log(err)
    //   }
    // })
    res.json(goals)
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: 'Server error' })
  }
}
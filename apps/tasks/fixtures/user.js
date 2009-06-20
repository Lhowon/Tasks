// ==========================================================================
// Project:   Tasks
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Tasks sc_require */

/** @class

  @version 0.1
	@author Suvajit Gupta
*/

sc_require('models/user');

Tasks.User.FIXTURES = [

	{ id: 1,
	name: "Pointy-Haired Boss",
	role: Tasks.consts.USER_ROLE_MANAGER,
	loginName: "bigboss" },

	{ id: 2,
	name: "Dilbert",
	role: Tasks.consts.USER_ROLE_DEVELOPER,
	loginName: "cyberpunk" },

	{ id: 3,
	name: "Asok",
	role: Tasks.consts.USER_ROLE_DEVELOPER,
	loginName: "hacker" },

	{ id: 4,
	name: "Larry",
	role: Tasks.consts.USER_ROLE_TESTER,
	loginName: "tst1" }

];
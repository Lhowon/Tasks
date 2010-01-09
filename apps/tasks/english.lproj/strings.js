// Place strings you want to localize here.  In your app, use the key and
// localize it using "key string": "text".  HINT: For your key names, use the
// English string with an underscore in front.  This way you can still see
// how your UI will look and you'll notice right away when something needs a
// localized string added to this file!
//

/** @class

  @version 0.1
  @author Suvajit Gupta
*/
SC.stringsFor('English', {

  // Authentication strings
  "_LoginPrompt": "Please sign in",
  "_LoginName:": "Login Name:",
  "_Login": "Login",
  "_LoginError": "Login failed, please try again",
  "_LoginSince": "Logged in since ",
  "_Confirmation": "Confirmation",
  "_LogoutConfirmation": "Are you sure you want to log out?",
  "_SaveConfirmation": "You have unsaved changes - save before logging out?",
  "_Yes": "Yes",
  "_No": "No",

  // Top Bar strings
  "_Tasks": "Tasks",
  "_Credits": "Credits: Suvajit Gupta, Sean Eidemiller, Josh Holt, and Matt Grantham",
  "_User:": "User: ",
  "_Role:": "Role:",
  "_SaveTooltip": "Save modified Tasks data to the server",
  "_RefreshTooltip": "Reload latest Tasks data from the server",
  "_Import": "Import",
  "_ImportTooltip": "Import Tasks data from a text format",
  "_Export": "Export",
  "_ExportTooltip": "Export Tasks data to a text format",
  "_ExportText": "Export as Text...",
  "_ExportHTML": "Export as HTML...",
  "_SettingsTooltip": "Administer Tasks users and settings",
  "_Help": "Online Help",
  "_HelpTooltip": "Open Tasks online help in a separate window",
  "_LogoutTooltip": "Sign out of Tasks and allow next user to sign in",
  "_Team": "Team",
  "_DisplayModeTooltip": "Choose 'Team' to see summary of all assignees, 'Tasks' to see details",
  "_AssigneeSelectionHint": "Specify assignees to show",
  "_AssigneeSelectionTooltip": "Use all or part of full/login name separated via commas or spaces; Type 'None' to see unassigned tasks",
  "_TasksSearchHint": "Search by task #IDs or name",
  "_TasksSearchTooltip": "Separate #IDs via commas or spaces, otherwise perform case-insensitive search (a caret prefix will find items that don't match the search pattern)",
  
  // Popup Pane/Panel strings
  "_CreateMissingUsers": "Create Missing Users",
  "_CreateMissingUsersTooltip": "Automatically create new users for unknown assignees/submitters found during importing",
  "_ImportInstructions:": "Paste or type in text to be imported:<br>(see format on right)",
  "_FormatOnscreenHelp": "Project Name {TimeLeft}<br>- Task Name {Effort} &lt;Submitter&gt; [Assignee] $Type @Status %Validation<br>| Description (1 or more lines following a Project or Task)",
  "_QuickFilters": "QUICK FILTERS",
  "_QuickFiltersTooltip": "Most commonly used filters",
  "_Troubled": "Troubled",
  "_TroubledTooltip": "Manage by Exception: what's risky or failed",
  "_Unfinished": "Unfinished",
  "_UnfinishedTooltip": "Deliver on Commitments: what's left to finish",
  "_Unvalidated": "Unvalidated",
  "_UnvalidatedTooltip": "Trust but Verify: what's left to validate",
  "_Verified": "Verified",
  "_VerifiedTooltip": "Ready for Primetime: what's done and passed",
  "_Showstoppers": "Showstoppers",
  "_ShowstoppersTooltip": "Are We There Yet: open high priority defects",
  "_All": "All",
  "_AllTooltip": "Full Plate: all tasks",
  "_Cancel": "Cancel",
  "_Close": "Close",
  "_Apply": "Apply",
  "_Project:": "Project: ",
  "_Add": "Add",
  "_Duplicate": "Duplicate",
  "_Delete": "Delete",
  
  // Project strings
  "_AddProject": "Add Project",
  "_AddProjectTooltip": "Add a new project",
  "_DelProject": "Del. Project",
  "_DelProjectTooltip": "Delete selected project",
  "_ProjectDeletionConfirmation": "Tasks in this project will become unallocated, are you sure you want to delete it?",
  "_NewProject": "New Project",
  "_AllTasks": "All Tasks",
  "_Unallocated": "Unallocated",
  "_UnallocatedTasks": "Unallocated Tasks",
  "_ProjectkEditorTooltip": "Click to view/edit project details (time left, description)",
  "_ReservedProject": "Is a reserved project (cannot modify/delete)",
  "_Has": "Has ",
  "_tasks": " task(s)",
  "_ProjectTimeLeftTooltip": "Time left shown on right",
  "_TimeLeft:": "Time Left:",
  "_TimeLeftOnscreenHelp": "May be unspecified, a decimal like '0.25'; units 'd' or 'h'",
  "_Statistics": "Statistics...",
  
  // Task strings
  "_AddTask": "Add Task",
  "_AddTaskTooltip": "Add a new task, to the same assignee if there is a selected task",
  "_DuplicateTask": "Dup. Task",
  "_Copy": ": copy",
  "_CopyID/Name": "Copy ID/Name",
  "_CopyLinkLocation": "Copy Link Location",
  "_NewTask": "New Task",
  "_DelTask": "Del. Task",
  "_DelTaskTooltip": "Delete selected task",
  "_Filter": "Filter Tasks",
  "_FilterTooltip": "Filter tasks using attributes (type, priority, status, validation)",
  "_Type": "TYPE",
  "_TypeTooltip": "Kind of task: user visible functionality, defect fix, or other",
  "_Feature": "Feature",
  "_Bug": "Bug",
  "_Other": "Other",
  "_Priority": "PRIORITY",
  "_PriorityTooltip": "Importance of task: must do, plan to do, do if you can",
  "_High": "High",
  "_Medium": "Medium",
  "_Low": "Low",
  "_Status": "STATUS",
  "_StatusTooltip": "Development status of task: show progress or obstacles",
  "_Planned": "Planned",
  "_Active": "Active",
  "_Done": "Done",
  "_finished": "finished",
  "_left": "left",
  "_Risky": "Risky",
  "_Validation": "VALIDATION",
  "_ValidationTooltip": "Testing status of completed task - independent verification recommended",
  "_Untested": "Untested",
  "_Passed": "Passed",
  "_Failed": "Failed",
  "_Effort:": "Effort:",
  "_EffortOnscreenHelp": "May be unspecified,<br> a decimal like '0.25',<br> or a range like '2-3';<br> units 'd' or 'h'",
  "_Description:": "Description:",
  "_DescriptionHint": "Enter detailed notes...",
  "_SubmitterTooltip": "Submitted by ",
  "_NewTaskTooltip": "This dot indicates a Planned task created or updated within the last day",
  "_TaskEffortTooltip": "Effort shown on right",
  "_TaskIdTooltip": "Unique ID for task; Dashes indicate unsaved tasks; Background color indicates validation status",
  "_TaskEditorTooltip": "Click to view/edit task details (submitter, assignee, effort, project, and description)",
  
  // User/Assignee strings
  "_AddUser": "Add User",
  "_AddUserTooltip": "Add a new user",
  "_UserDeletionConfirmation": "Are you sure you want to delete this user?",
  "_DelUser": "Del. User",
  "_DelUserTooltip": "Delete selected user",
  "_FullName:": "Full Name:",
  "_FirstLast": "Firstname Lastname",
  "_Initials": "Initials",
  "_Unassigned": "Unassigned",
  "_Manager": "Manager",
  "_Developer": "Developer",
  "_Tester": "Tester",
  "_Guest": 'Guest',
  "_Submitter:": "Submitter: ",
  "_Assignee:": "Assignee: ",
  "_AssigneeNotLoaded": ", is not loaded; ",
  "_AssigneeUnderLoaded": ", is under loaded; ",
  "_AssigneeProperlyLoaded": ", is properly loaded; ",
  "_AssigneeOverloaded": ", is overloaded; ",
  "_AssigneeEffortTooltip": "Effort totaled on right",
  "_NewUserSignup": "New user? Click here to signup.",
  "_SignupPrompt": "Guest User Signup",
  "_Email:": "Email:",
  "_InvalidEmailAddress": "This email address",
  "_EmailAddress": "Your Email Address",
  "_Password:": "Password:",
  "_PasswordHint": "Your Password",
  "_Signup": "Signup",
  "_UserManager": "User Manager",
  "_Users": " registered user(s)",
  
  // Status Bar strings
  "_Displaying": "Displaying ",
  "_Projects": " project(s), ",
  "_Assignees": " assignee(s), and ",
  "_RedFlags": " red flag(s)",
  "_UsersLoaded": "Loaded users, ",
  "_TasksLoaded": "tasks, ",
  "_ProjectsLoaded": " and projects at ",
  "_SaveMessage": "Data last saved "
    
});

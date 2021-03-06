/*globals Tasks sc_require module test ok equals */

/**
 * Tasks Summary View unit tests.
 *
 * @author Suvajit Gupta
 */
// http://localhost:4400/tasks/en/current/tests/views/summary.html

sc_require('core');
sc_require('views/summary'); 

var emptyTree = [];
var sampleTree = SC.Object.create({ treeItemChildren: [
  SC.Object.create({ tasksCount: 5, riskyTasksCount: 2 }),
  SC.Object.create({ tasksCount: 4, failedTasksCount: 1 }),
  SC.Object.create({ tasksCount: 3 })
] });

var pane = SC.ControlTestPane.design()
  .add('null', Tasks.SummaryView, {
    layout: { top: 0, height: 16, width: 250, left: 0 },
    tasksTree: null
  })
  .add('empty', Tasks.SummaryView, {
    layout: { top: 0, height: 16, width: 250, left: 0 },
    displayMode: Tasks.DISPLAY_MODE_TASKS,
    tasksTree: emptyTree
  })
  .add('tasks', Tasks.SummaryView, {
    layout: { top: 0, height: 16, width: 250, left: 0 },
    displayMode: Tasks.DISPLAY_MODE_TASKS,
    tasksTree: sampleTree
  })
  .add('team', Tasks.SummaryView, {
    layout: { top: 0, height: 16, width: 250, left: 0 },
    displayMode: Tasks.DISPLAY_MODE_TEAM,
    tasksTree: sampleTree
  });
  
pane.show(); // add a test to show the test pane
window.pane = pane;

// ..........................................................
// Summary View Tests
// 
module("Tasks.SummaryView tests", pane.standardSetup());

test("startup", function(){
  var view = pane.view('null');
  ok(view, 'view should render');
  equals(view.$().get(0).innerHTML, '', 'Null summary');
});

test("empty", function(){
  var view = pane.view('empty');
  equals(view.$().get(0).innerHTML, '0 assignees and 0 tasks displayed', 'Empty summary');
});


test("TASKS display mode", function(){
  var view = pane.view('tasks');
  equals(view.$().get(0).innerHTML, '3 assignees and 12 tasks displayed', 'Sample TASKS display mode summary');
});

test("TEAM display mode", function(){
  var view = pane.view('team');
  equals(view.$().get(0).innerHTML, '3 assignees and 2 red flags displayed', 'Sample TEAM display mode summary');
});
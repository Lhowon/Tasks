// ==========================================================================
// Project: Tasks
// ==========================================================================
/*globals Tasks sc_require */
sc_require('views/welcome');
sc_require('views/summary');
sc_require('views/task');
/** @namespace

  This page describes the main user interface for the Tasks application.
  
  @extends SC.Object
  @author Suvajit Gupta
  @author Joshua Holt
*/

Tasks.mainPage = SC.Page.design({

  mainPane: SC.MainPane.design({
    
    childViews: 'topView middleView bottomView'.w(),
    
    topView: SC.View.design(SC.Border, {
      layout: { top: 0, left: 0, right: 0, height: 42 },
      borderStyle: SC.BORDER_BOTTOM,
      childViews: [
      
      SC.LabelView.design({
        layout: { centerY: 0, height: 35, left: 2, width: 35 },
        classNames: ['tasks-logo']
      }),
      
      SC.LabelView.design({
        layout: { centerY: 5, height: 30, left: 45, width: 110 },
        fontWeight: SC.BOLD_WEIGHT,
        controlSize: SC.LARGE_CONTROL_SIZE,
        value: "_Tasks".loc() + " v" + Tasks.VERSION
      }),
      
      Tasks.WelcomeView.design({
        layout: { centerY: 2, height: 30, left: 155, width: 110 },
        textAlign: SC.ALIGN_RIGHT,
        controlSize: SC.TINY_CONTROL_SIZE,
        valueBinding: 'Tasks.user'
      }),
      
      SC.ButtonView.design({
        layout: { centerY: 0, height: 18, left: 265, width: 55 },
        title: "_User:".loc(),
        titleMinWidth: 0,
        target: 'Tasks',
        action: 'openUserManager'
      }),
      
      SC.SelectFieldView.design({
        layout: { centerY: 2, height: 25, left: 325, width: 150 },
        nameKey: 'name',
        objects: Tasks.User.FIXTURES // TODO: [SG] Add "All" - the default, and populate from store/not fixtures
        // TODO: [SG] assign a valueBinding
      }),
      
      SC.TextFieldView.design({
        layout: { centerY: 0, height: 16, left: 500, width: 250 },
        hint: "_SearchHint".loc()
        // TODO: implement type-ahead searching capability
      }),
      
      SC.ButtonView.design({
        layout: { centerY: 0, height: 21, right: 180, width: 50 },
        title:  "_Import".loc(),
        titleMinWidth: 0,
        target: 'Tasks',
        action: 'importData'
      }),

      SC.ButtonView.design({
        layout: { centerY: 0, height: 21, right: 125, width: 50 },
        title:  "_Export".loc(),
        titleMinWidth: 0,
        target: 'Tasks',
        action: 'exportData'
      }),
      
      SC.ButtonView.design({
        layout: { centerY: 0, height: 21, right: 80, width: 40 },
        title: "_Save".loc(),
        titleMinWidth: 0,
        // TODO: [SG] add isEnabledBinding to track changes,
        target: 'Tasks',
        action: 'saveData'
      }),
      
      SC.ButtonView.design({
        layout: { centerY: 0, height: 21, right: 38, width: 25 },
        title: "?",
        titleMinWidth: 0,
        target: 'Tasks',
        action: 'showHelp'
      }),
      
      SC.ButtonView.design({
        layout: { centerY: 0, height: 21, right: 5, width: 25 },
        title: "X",
        titleMinWidth: 0,
        target: 'Tasks',
        action: 'exit'
      })
      
      ]
      
    }),
    
    middleView: SC.SplitView.design({
      layout: { top: 42, bottom: 42, left: 0, right: 0 },
      defaultThickness: 100,
      topLeftMaxThickness: 250,
      topLeftMinThickness: 200,
      
      topLeftView: SC.ScrollView.design({
        hasHorizontalScroller: NO,
        borderStyle: SC.BORDER_GRAY,

        contentView: SC.ListView.design({
          contentValueKey: 'displayName',
          contentBinding: 'Tasks.projectsController.arrangedObjects',
          selectionBinding: 'Tasks.projectsController.selection',
          hasContentIcon: YES,
          contentIconKey:  'icon',
          contentValueEditable: true,
          canReorderContent: true,
          canDeleteContent: true,
          destroyOnRemoval: YES
        })
      }),
      
      bottomRightView: SC.ScrollView.design({
        hasHorizontalScroller: NO,
        borderStyle: SC.BORDER_GRAY,

        contentView: SC.SourceListView.design({
          contentValueKey: 'displayName',
          contentBinding: 'Tasks.tasksController.arrangedObjects',
          selectionBinding: 'Tasks.tasksController.selection',
          hasContentIcon: YES,
          contentIconKey: 'icon',
          contentValueEditable: true,
          canReorderContent: true,
          canDeleteContent: true,
          destroyOnRemoval: YES,
          exampleView: Tasks.TaskView
        })
      })
    }),
    
    // for use in selecting first project at starup
    projectsList: SC.outlet('middleView.topLeftView.childViews.0.contentView'),
    
    bottomView: SC.View.design(SC.Border, {
      layout: { bottom: 0, left: 0, right: 0, height: 35 },
      childViews: 'projectsToolbarView tasksToolbarView'.w(),
      borderStyle: SC.BORDER_TOP,
      
      projectsToolbarView: SC.View.design({
        layout: { top: 0, left: 0, bottom: 0, width: 250 },
        childViews: [
        
        SC.ButtonView.design({
          layout: { centerY: 0, left: 5, height: 21, width: 25 },
          title: "+",
          titleMinWidth: 0,
          target: 'Tasks',
          action: 'addProject'
        }),

        SC.ButtonView.design({
          layout: { centerY: 0, left: 35, height: 21, width: 25 },
          title: "-",
          titleMinWidth: 0,
          isEnabledBinding: 'Tasks.projectsController.hasSelection',
          target: 'Tasks',
          action: 'deleteProject'
        }),
        
        Tasks.SummaryView.design({
          layout: { centerY: 2, left: 110, height: 21, width: 90 },
          valueBinding: 'Tasks.assignmentsController.length'
        })
        
        ]
        
      }),
      
      tasksToolbarView: SC.View.design({
        layout: { top: 0, left: 260, bottom: 0, right: 0 },
        childViews: [

        SC.ButtonView.design({
          layout: { centerY: 0, height: 21, left: 5, width: 25 },
          title:  "+",
          titleMinWidth: 0,
          target: 'Tasks',
          action: 'addTask'
        }),

        SC.ButtonView.design({
          layout: { centerY: 0, height: 21, left: 35, width: 25 },
          title:  "-",
          titleMinWidth: 0,
          isEnabledBinding: 'Tasks.tasksController.hasSelection',
          target: 'Tasks',
          action: 'deleteTask'
        }),
        
        SC.SeparatorView.design({
          layoutDirection: SC.LAYOUT_VERTICAL,
          layout: { top: 5, bottom: 5, left: 85, width: 4 }
        }),

        SC.RadioView.design({
          layout: { centerY: 2, height: 21, left: 105, width: 180 },
          escapeHTML: NO,
          items: [
            { title: '<span class=tasks-priority-high>' + Tasks.TASK_PRIORITY_HIGH + '</span>',
              value: Tasks.TASK_PRIORITY_HIGH },
            { title: '<span class=tasks-priority-medium>' + Tasks.TASK_PRIORITY_MEDIUM + '</span>',
              value: Tasks.TASK_PRIORITY_MEDIUM },
            { title: '<span class=tasks-priority-low>' + Tasks.TASK_PRIORITY_LOW + '</span>',
              value: Tasks.TASK_PRIORITY_LOW }
          ],
          itemTitleKey: 'title',
          itemValueKey: 'value',
          valueBinding: 'Tasks.taskController.priority',
          isEnabledBinding: 'Tasks.tasksController.hasSelection',
          layoutDirection: SC.LAYOUT_HORIZONTAL
        }),
        
        SC.SeparatorView.design({
          layoutDirection: SC.LAYOUT_VERTICAL,
          layout: { top: 5, bottom: 5, left: 275, width: 4 }
        }),

        SC.RadioView.design({
          layout: { centerY: 2, height: 21, left: 295, width: 240 },
          escapeHTML: NO,
          items: [
            { title: '<span class=tasks-status-planned>' + Tasks.TASK_STATUS_PLANNED + '</span>',
              value: Tasks.TASK_STATUS_PLANNED },
            { title: '<span class=tasks-status-active>' + Tasks.TASK_STATUS_ACTIVE + '</span>',
              value: Tasks.TASK_STATUS_ACTIVE },
            { title: '<span class=tasks-status-done>' + Tasks.TASK_STATUS_DONE + '</span>',
              value: Tasks.TASK_STATUS_DONE },
            { title: '<span class=tasks-status-risky>' + Tasks.TASK_STATUS_RISKY + '</span>',
              value: Tasks.TASK_STATUS_RISKY }
          ],
          itemTitleKey: 'title',
          itemValueKey: 'value',
          valueBinding: 'Tasks.taskController.status',
          isEnabledBinding: 'Tasks.tasksController.hasSelection',
          layoutDirection: SC.LAYOUT_HORIZONTAL
        }),
        
        SC.SeparatorView.design({
          layoutDirection: SC.LAYOUT_VERTICAL,
          layout: { top: 5, bottom: 5, left: 535, width: 4 }
        }),

        SC.RadioView.design({
          layout: { centerY: 2, height: 21, left: 555, width: 220 },
          escapeHTML: NO,
          items: [
            { title: '<span class=tasks-validation-untested>' + Tasks.TASK_VALIDATION_UNTESTED + '</span>',
              value: Tasks.TASK_VALIDATION_UNTESTED },
            { title: '<span class=tasks-validation-passed>' + Tasks.TASK_VALIDATION_PASSED + '</span>',
              value: Tasks.TASK_VALIDATION_PASSED },
            { title: '<span class=tasks-validation-failed>' + Tasks.TASK_VALIDATION_FAILED + '</span>',
              value: Tasks.TASK_VALIDATION_FAILED }
          ],
          itemTitleKey: 'title',
          itemValueKey: 'value',
          valueBinding: 'Tasks.taskController.validation',
          isEnabledBinding: 'Tasks.tasksController.hasSelection',
          layoutDirection: SC.LAYOUT_HORIZONTAL
        })
        
        ]
        
      })
      
    })
  })
});

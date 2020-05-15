import {IonItem} from "@ionic/react";
import React from "react";

export default {
  translation: {
    app: {
      title: 'WellBeyond Mobile App',
      logo: 'WellBeyond Log',
    },
    menu: {
      about: 'About WellBeyond',
      privacy: 'Privacy Policy',
      terms: 'Terms Of Service',
      training: 'Training',
      account: 'Account',
      login: 'Login',
      logout: 'Logout',
      signup: 'Signup',
      support: 'Support',
      darkMode: 'Dark Mode',
      trainerMode: 'Trainer Mode',
      pleaseWait: 'Please wait...'
    },
    buttons: {
      previous: 'Prev',
      next: 'Next',
      done: 'Done',
      close: 'Close',
      zoomIn: '+',
      zoomOut: '-'
    },
    registration: {
      modals: {
        changeEmail: 'Change Email Address',
        changePassword: 'Change Password',
        changePhoto: 'Change Profile Photo',
        changeProfile: 'Change Profile Information',
        reauthenticate: 'Reenter your password'
      },
      labels: {
        name: 'First and Last Name',
        email: 'Email Address',
        oldEmail: 'Current Email Address',
        newEmail: 'New Email Address',
        loginUsername: 'Email Address',
        loginPassword: 'Password',
        password: 'Password (8 characters minimum)',
        newPassword: 'New Password (8 characters minimum)',
        passwordRepeat: 'Repeat Password',
        organization: 'Organization Name (optional)',
        pleaseAcceptTerms: 'Please check the box indicating that you have read and agree to these terms of use.',
        userAcceptsTerms: 'I agree to the terms and conditions above',
        avatar: 'Avatar'
      },
      errors: {
        nameRequired: 'Name is required',
        emailRequired: 'Email is required',
        passwordRequired: 'Password is required',
        passwordLength: 'Password must be at least 8 characters',
        passwordMismatch: 'Passwords don\'t match',
        termsNotChecked: 'Please check the box to continue',
        loginUsernameRequired: 'Email is required',
        loginPasswordRequired: 'Password is required',
      },
      buttons: {
        login: 'Login',
        signup: 'Signup',
        changePassword: 'Update Password',
        changeProfile: 'Update Profile',
        changeEmail: 'Update Email',
        changePhoto: 'Update Photo',
        createAccount: 'Create Account',
        reauthenticate: 'Verify Password',
        acceptTerms: 'Get Started',
      },
      messages: {
        passwordChanged: 'Password updated',
        emailChanged: 'Email updated',
        profileChanged: 'Profile updated',
      },
      pages: {
        signup: 'Signup',
        login: 'Login',
        terms: 'Accept Terms',
        account: 'Account',
      }
    },
    training: {
      pages: {
        start: 'New Training Session'
      },
      labels: {
        location: 'Where are you holding the training?',
        groupType: 'What type of group is it for?',
        groupSize: 'How large is the group?',
      },
      groupTypes: {
        committee: 'Water Committee',
        household: 'Household',
        school: 'School',
        clinic: 'Medical Clinic',
        other: 'Other',
        selectOne: 'Select a group type',
      },
      groupSizes: {
        xs: '1-5',
        sm: '6-10',
        md: '11-20',
        lg: '21-50',
        xl: '50-100',
        xxl: 'More than 100',
        selectOne: 'Select a group size',
      },
      messages: {
        partiallyComplete: 'You have completed {{completed}} of the {{count}} modules for {{subject}}.',
        fullyComplete: 'You have completed the training for {{subject}}.',
        sessionDescription: 'Training for {{type}} group of {{size}} people at {{location}}',
        sessionStartedAt: 'Started {{date, dateAndTime}}',
        sessionCompletedAt: 'Completed {{date, dateAndTime}}',
        swipeInstructions: 'Swipe left to resume session or right to discard it'
      },
      errors: {
        locationRequired: 'Please provide a location for the training',
        groupTypeRequired: 'Please select a group type for the training',
        groupSizeRequired: 'Please select a group size for the training',
      },
      headers: {
        yourTraining: '1. Complete the Training',
        trainOthers: '2. Share the Training',
        previousTraining: 'Previous Training Sessions'
      },
      buttons: {
        startTraining: 'Begin Your Training',
        reviewTraining: 'Review Your Training',
        resumeTraining: 'Resume Your Training',
        startNewSession: 'Start a New Session',
        resumeSession: 'Resume',
        archiveSession: 'Discard',
        beginTraining: 'Begin the Training',
        ok: 'OK',
        cancel: 'CANCEL'
      }
    },
    resources: {
      subjects: {
        name: 'Subject',
        name_plural: 'Subjects',
        nonefound: 'No Subjects Found',
      },
      lessons: {
        name: 'Lesson',
        name_plural: 'Lessons',
        imageZoom: 'Image Zoom',
        imageZoomHelp: 'Use pinching gestures the controls below zoom in and out',
        imageZoomToolbar: 'Zoom +/-',
        intro: {
          title: 'Introduction',
          completed: 'You have already completed this module, but you can come back here any time to review.',
          firsttime: 'Before you start the module, we\'re going to ask you a few questions to see how much you already know.  We\'ll ask you these questions again after you have completed the module.'
        },
        summary: {
          title: 'Lesson Complete',
          completed: 'You have successfully completed this module and correctly answered {{score}}% of the questions.',
          nextLesson: 'The next module is {{lesson}}. Click next when you are ready to begin.',
          allDone: 'You have completed all the modules for {{subject}}.',
         },
        questions: {
          title: 'Question {{num}} of {{count}}',
          right: 'Great job, you got it right.',
          wrong: 'Sorry, you got it wrong. The correct answer is ',
        },
        attestationHeader: 'Please confirm that you undertand this information by checking the box below.',
        completed: 'Completed',
        introduction: 'Introduction',
      }
    }
  }
};

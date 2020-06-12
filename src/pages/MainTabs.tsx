import React from 'react';
import {IonContent, IonLoading, IonRouterOutlet} from '@ionic/react';
import {Redirect, Route} from 'react-router';
import TrainingPage from './TrainingPage';
import SubjectPage from './SubjectPage';
import SubjectProgressPage from './SubjectProgressPage';
import LessonIntroPage from './LessonIntroPage';
import LessonSummaryPage from './LessonSummaryPage';
import LessonPage from './LessonPage';
import QuestionPage from './QuestionPage';
import QuestionPreviewPage from './QuestionPreviewPage';
import {connect} from "../data/connect";
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import StartSessionPage from "./StartSessionPage";

interface OwnProps {}

interface StateProps {
  isLoggedIn?: boolean;
  isRegistered?: boolean;
  acceptedTerms?: boolean;
}

interface DispatchProps { }

interface MainTabsProps extends OwnProps, StateProps, DispatchProps { }

const MainTabs: React.FC<MainTabsProps> = ({isLoggedIn, isRegistered, acceptedTerms}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  if (typeof isLoggedIn === 'undefined') {
    return (
      <IonContent>
        <IonLoading
          isOpen={true}
          message={t('menu.pleaseWait')}
        />
      </IonContent>
    );
  }
  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }
  if (!isRegistered) {
    return <Redirect to="/register" />;
  }
  if (!acceptedTerms) {
    return <Redirect to="/terms" />;
  }

  return (
      <IonRouterOutlet id='tabs' animated={false}>
        <Redirect exact path="/tabs" to="/tabs/training" />
        {/*
          Using the render method prop cuts down the number of renders your components will have due to route changes.
          Use the component prop when your component depends on the RouterComponentProps passed in automatically.
        */}
        <Route path="/tabs/training" render={() => <TrainingPage />} exact={true} />
        <Route path="/tabs/subjects/:subjectId" component={SubjectPage} exact={true} />
        <Route path="/tabs/subjects/:subjectId/progress" component={SubjectProgressPage} exact={true} />
        <Route path="/tabs/subjects/:subjectId/start" component={StartSessionPage} exact={true} />
        <Redirect exact path="/tabs/subjects/:subjectId/lessons/:lessonId" to="/tabs/subjects/:subjectId/lessons/:lessonId/intro" />
        <Route path="/tabs/subjects/:subjectId/lessons/:lessonId/intro" component={LessonIntroPage} exact={true} />
        <Route path="/tabs/subjects/:subjectId/lessons/:lessonId/summary" component={LessonSummaryPage} exact={true} />
        <Route path="/tabs/subjects/:subjectId/lessons/:lessonId/page/:pageId" component={LessonPage} exact={true} />
        <Route path="/tabs/subjects/:subjectId/lessons/:lessonId/question/:questionId" component={QuestionPage} exact={true} />
        <Route path="/tabs/subjects/:subjectId/lessons/:lessonId/preview/:questionId" component={QuestionPreviewPage} exact={true} />
      </IonRouterOutlet>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    isLoggedIn: state.user.isLoggedIn,
    isRegistered: state.user.isRegistered,
    acceptedTerms: state.user.acceptedTerms,
  }),
  component: MainTabs
});


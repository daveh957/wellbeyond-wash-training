import React, {useEffect, useRef} from 'react';

import {
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonItemGroup,
  IonList,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';

import './TrainingPage.scss'

import {Trans, useTranslation} from "react-i18next";
import i18n from '../i18n';
import * as selectors from '../data/selectors';
import {connect} from '../data/connect';
import {Subject, Topic} from '../models/Training';
import SubjectItem from "../components/SubjectItem";
import TopicItem from "../components/TopicItem";
import {Redirect} from "react-router-dom";
import {RouteComponentProps} from "react-router";
import {Organization} from "../models/User";

interface OwnProps extends RouteComponentProps {
}

interface StateProps {
  subjects: Subject[],
  topics: Topic[],
  topic?: Topic,
  organization?: Organization,
  defaultLanguage?: string
}

interface DispatchProps {
}

type TrainingPageProps = OwnProps & StateProps & DispatchProps;

const TrainingPage: React.FC<TrainingPageProps> = ({ subjects, topics, topic, organization, defaultLanguage}) => {

  const pageRef = useRef<HTMLElement>(null);
  const { t } = useTranslation(['translation'], {i18n} );
  useEffect(() => {
    i18n.changeLanguage(defaultLanguage || 'en');
  }, [defaultLanguage]);

  if (subjects && subjects.length === 1) {
    return <Redirect to={`/tabs/subjects/${subjects[0].id}`} />
  }

  return (
    <IonPage ref={pageRef} id="subject-list">
        <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          {topic || topics.length < 2 ?
            <IonTitle>{t('resources.subjects.name_plural')}</IonTitle>
            :
            <IonTitle>{t('resources.topics.name_plural')}</IonTitle>
          }
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        {organization && topics && subjects ?
          topic || topics.length < 2 ?
            (subjects.length ?
            (<IonList>
              {subjects.map((subject, index: number) => (
                <IonItemGroup key={`subject-${index}`}>
                    <SubjectItem subject={subject} />
                </IonItemGroup>))
              }
            </IonList>) :
            <IonList>
              <IonItemGroup>
                <IonItem lines="none">
                  <p>
                    <Trans
                      i18nKey="training.messages.noSubjects"
                      values={{
                        contactName:organization.contactName,
                        contactEmail: organization.contactEmail}}/>
                  </p>
                </IonItem>
              </IonItemGroup>

            </IonList>
            )
          :
            (<IonList>
              {topics.map((topic, index: number) => (
                <IonItemGroup key={`topic-${index}`}>
                    <TopicItem topic={topic} />
                </IonItemGroup>))
              }
            </IonList>)
        :
          <IonLoading
            isOpen={!subjects}
            message={'Please wait...'}
            duration={5000}
          />
        }
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    subjects: selectors.getSubjectsForTopic(state, ownProps),
    topics: selectors.getTopicsForOrganization(state),
    topic: selectors.getTopic(state, ownProps),
    organization: selectors.getUserOrganization(state),
    defaultLanguage: state.user.defaultLanguage
  }),
  component: React.memo(TrainingPage)
});

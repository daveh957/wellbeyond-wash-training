import React, {useContext, useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
  NavContext
} from '@ionic/react';
import './Login.scss';
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {connect} from '../data/connect';
import {RouteComponentProps} from 'react-router';
import {GroupType, Lesson, Subject, TrainingSession} from "../models/Training";
import * as selectors from "../data/selectors";
import BackToSubjectLink from "../components/BackToSubject";
import {startTrainingSession} from "../data/user/user.actions";
import {Organization} from "../models/User";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lessons: Lesson[];
}

interface StateProps {
  userId?: string;
  organization?: Organization;
  community?: string;
}

interface DispatchProps {
  startTrainingSession: typeof startTrainingSession;
}

interface StartTrainingSessionProps extends OwnProps, StateProps, DispatchProps { }

const StartTrainingSession: React.FC<StartTrainingSessionProps> = ({subject, lessons, userId, organization, community, startTrainingSession }) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const {navigate} = useContext(NavContext);

  const [formValues, setFormValues] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [communityList, setCommunityList] = useState<string[]>();

  useEffect(() => {
    i18n.changeLanguage(subject.locale || 'en');
  }, [subject]);

  useEffect(() => {
    if (community && formValues && !formValues.community) {
      const values = {...formValues};
      values.community = community;
      setFormValues(values);
    }
    if (organization && organization.communities && organization.communities.length) {
      let list = organization.communities.map((c:any) => c.name).sort((a: string, b: string) => {
        return a < b ? -1 : +1;
      });
      list.push('Other');
      setCommunityList(list);
    }
    else {
      setCommunityList(undefined);
    }
  }, [organization, community, formValues]);

  const handleChange = (field:string, value:string|number) => {
    let errors = {...formErrors};
    let values = {...formValues};
    errors[field] = null;
    values[field] = value;
    setFormErrors(errors);
    setFormValues(values);
  }
  const validate = ():boolean => {
    let errors = {...formErrors};
    errors.groupType = formValues.groupType ? null : 'training.errors.groupTypeRequired';
    errors.groupSize = formValues.groupSize ? null : 'training.errors.groupSizeRequired';
    errors.community = formValues.community || !communityList || !communityList.length ? null : 'registration.errors.communityRequired';
    setFormErrors(errors);
    return !Object.values(errors).some(x => (x !== null && x !== ''));
  }

  const startNewTrainingSession = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (validate()) {
      let session: TrainingSession = {
        subjectId: subject.id,
        userId: userId || '',
        organizationId: organization && organization.id,
        organization: organization && organization.name,
        community: formValues.community,
        started: new Date(),
        archived: false,
        name: formValues.name,
        groupType: formValues.groupType,
        groupSizeNum: parseInt(formValues.groupSize),
        lessons: {}
      };
      session.id = userId + ':' + session.subjectId + ':' + (session.started && session.started.getTime());
      lessons.forEach((l) => {
        if (session.lessons && l.id) {
          session.lessons[l.id] = {
            id: l.id,
            lessonId: l.id,
            answers: [],
            pageViews: []
          };
        }
      });
      startTrainingSession(session);
      navigate('/tabs/subjects/' + subject.id + '/progress?tsId=' + session.id);
    }
  }

  return (
    <IonPage id="start-session-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackToSubjectLink subject={subject}/>
          </IonButtons>
          <IonTitle>{t('training.pages.start')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form noValidate onSubmit={startNewTrainingSession}>
          <IonList>

            {communityList && communityList.length ?
              <IonItem>
                <IonLabel position="stacked" color="primary">{t('training.labels.community')}</IonLabel>
                <IonSelect value={formValues.community}
                           placeholder={t('registration.communities.selectOne')}
                           cancelText={t('buttons.cancel')}
                           okText={t('buttons.ok')}
                           onIonChange={e => {handleChange('community', e.detail.value!);}}>
                  {communityList.map((c:string) => <IonSelectOption value={c} key={c}>{c}</IonSelectOption>)}
                </IonSelect>
                {formSubmitted && formErrors.community && <IonText color="danger">
                  <p className="ion-padding-start">
                    {t(formErrors.community, {organization: organization ? organization.name : ''})}
                  </p>
                </IonText>}
              </IonItem> : undefined}

            <IonItem>
              <IonLabel position="stacked" color="primary">{t('training.labels.groupType')}</IonLabel>
              {subject.groupTypes && subject.groupTypes ?
                <IonSelect value={formValues.groupType}
                           placeholder={t('training.groupTypes.selectOne')}
                           cancelText={t('training.buttons.cancel')}
                           okText={t('training.buttons.ok')}
                           onIonChange={e => {handleChange('groupType', e.detail.value!);}}>
                  {subject.groupTypes.map((g:GroupType) => <IonSelectOption value={g.name} key={'gt-'+g.name}>{g.name}</IonSelectOption>)}
                </IonSelect>
                :
                <IonSelect value={formValues.groupType}
                           placeholder={t('training.groupTypes.selectOne')}
                           cancelText={t('training.buttons.cancel')}
                           okText={t('training.buttons.ok')}
                           onIonChange={e => {handleChange('groupType', e.detail.value!);}}>
                  <IonSelectOption value="Water Committee">{t('training.groupTypes.committee')}</IonSelectOption>
                  <IonSelectOption value="Household">{t('training.groupTypes.household')}</IonSelectOption>
                  <IonSelectOption value="School">{t('training.groupTypes.school')}</IonSelectOption>
                  <IonSelectOption value="Medical Clinic">{t('training.groupTypes.clinic')}</IonSelectOption>
                  <IonSelectOption value="Other">{t('training.groupTypes.other')}</IonSelectOption>
                </IonSelect>
              }
            </IonItem>

            {formSubmitted && formErrors.groupType && <IonText color="danger">
              <p className="ion-padding-start">
                {t(formErrors.groupType)}
              </p>
            </IonText>}

            <IonItem>
              <IonLabel position="stacked" color="primary">{t('training.labels.groupSize')}</IonLabel>
              <IonInput value={formValues.groupSize}
                        type="number"
                        inputmode="numeric"
                        min="1"
                        max="100000"
                        step="1"
                        onIonChange={e => {handleChange('groupSize', e.detail.value!);}}>
              </IonInput>
            </IonItem>

            {formSubmitted && formErrors.groupSize && <IonText color="danger">
              <p className="ion-padding-start">
                {t(formErrors.groupSize)}
              </p>
            </IonText>}

          <IonItem>
              <IonLabel position="stacked" color="primary">{t('training.labels.sessionName')}</IonLabel>
              <IonInput name="sessionName" type="text" value={formValues.name} spellCheck={false} autocapitalize="on" autocomplete="off" required={false}
                        onIonChange={e => {handleChange('name', e.detail.value!);}}>
              </IonInput>
            </IonItem>

          </IonList>

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">{t('training.buttons.beginTraining')}</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>

    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    startTrainingSession
  },
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lessons: selectors.getSubjectLessons(state, ownProps),
    userId: selectors.getUserId(state),
    organization: selectors.getUserOrganization(state),
    community: selectors.getUserCommunity(state),
  }),
  component: StartTrainingSession
})

import React, {useEffect, Fragment, useState} from 'react';
import { Subject, Lesson, Question } from '../models/Training';
import {
  IonCard,
  IonCardHeader,
  IonItem,
  IonLabel,
  IonCardContent,
  IonSlide,
  IonCardSubtitle,
  IonCardTitle,
  IonList,
  IonRadioGroup,
  IonListHeader, IonRadio, IonInput, IonButton
} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";

interface QuestionDetailProps {
  subject: Subject,
  lesson: Lesson;
  question: Question;
  idx: number;
  preLesson: boolean;
  save(question:Question, preLesson: boolean, answer:string|number): void;
  next(): void;
}

const QuestionDetail: React.FC<QuestionDetailProps> = ({ subject,lesson, question, idx, preLesson, save, next}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [answer, setAnswer] = useState<string|number>();
  const [showNext, setShowNext] = useState<boolean>();
  const [lockAnswer, setLockAnswer] = useState<boolean>();
  const handleAnswer = (value:(string|number)) => {
    setAnswer(value);
    save(question, preLesson, value);
    if (!preLesson) {
      setLockAnswer(true)
    }
  }
  useEffect(() => {
    if (answer) {
      setShowNext(true);
    }
  }, [answer]);

  const renderQuestionContent:any = (question:Question) => {
    if (!question) {
      return;
    }
    if (question.questionType === 'yes-no') {
      return (
        <IonList>
          <IonRadioGroup value={answer} onIonChange={e => handleAnswer(e.detail.value)}>
            <IonItem>
              <IonLabel>Yes</IonLabel>
              <IonRadio disabled={lockAnswer} slot="start" value="yes" />
            </IonItem>
            <IonItem>
              <IonLabel>No</IonLabel>
              <IonRadio disabled={lockAnswer} slot="start" value="no" />
            </IonItem>
          </IonRadioGroup>
        </IonList>
      );
    }
    else if (question.questionType === 'choose-one' && question.choices) {
      return (
        <IonList>
          <IonRadioGroup value={answer} onIonChange={e => handleAnswer(e.detail.value)}>
            {question.choices.map((choice) =>  {
              return <IonItem>
                <IonLabel>{choice.value}</IonLabel>
                <IonRadio disabled={lockAnswer} slot="start" value={choice.value} />
              </IonItem>
            })}
          </IonRadioGroup>
        </IonList>
      );
    }
    else if (question.questionType === 'number') {
      return (
        <IonList>
          <IonItem>
            <IonInput disabled={lockAnswer} type="number" value={answer} placeholder={t('questions.enterNumber')} onIonChange={e => handleAnswer(parseInt(e.detail.value!, 10))}></IonInput>
          </IonItem>
        </IonList>
      );
    }
  }

  return (
    <IonCard className='lesson-card'>
      <IonCardHeader>
        <IonCardSubtitle>Question {idx+1}</IonCardSubtitle>
        <IonCardTitle>{question.questionText}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className='question-answer'>
        {renderQuestionContent(question)}
        {question && answer && !preLesson ?
          <div className='question-explanation'>
            {answer === question.correctAnswer ?
              <div>Great job, you got it right.</div>
            :
            <div>Sorry, you got it wrong.</div>}
            <div dangerouslySetInnerHTML={{__html: question.explanation || ''}}></div>
          </div>
          : undefined }
        <IonButton expand='block' disabled={!showNext} onClick={next}>{t('buttons.next')}</IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default QuestionDetail;

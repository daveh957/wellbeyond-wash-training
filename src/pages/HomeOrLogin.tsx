import React from 'react';
import {connect} from '../data/connect';
import {Redirect} from 'react-router';
import {IonContent, IonLoading} from '@ionic/react';

interface StateProps {
  isLoggedIn?: boolean;
  acceptedTerms: boolean;
}

const HomeOrLogin: React.FC<StateProps> = ({ isLoggedIn , acceptedTerms}) => {
  if (typeof isLoggedIn === 'undefined' || typeof acceptedTerms === 'undefined') {
    return (
      <IonContent>
        <IonLoading
          isOpen={true}
          message={'Please wait...'}
        />
      </IonContent>
    );
  }
  if (isLoggedIn === false) {
    return <Redirect to="/login" />;
  }
  return acceptedTerms ? <Redirect to="/tabs" /> : <Redirect to="/terms" />
};

export default connect<{}, StateProps, {}>({
  mapStateToProps: (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    acceptedTerms: state.user.acceptedTerms
  }),
  component: HomeOrLogin
});

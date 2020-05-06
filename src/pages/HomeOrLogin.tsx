import React from 'react';
import {connect} from '../data/connect';
import {Redirect} from 'react-router';
import {IonContent, IonLoading} from '@ionic/react';

interface StateProps {
  isLoggedIn?: boolean;
}

const HomeOrLogin: React.FC<StateProps> = ({ isLoggedIn }) => {
  if (typeof isLoggedIn === 'undefined') {
    return (
      <IonContent>
        <IonLoading
          isOpen={true}
          message={'Please wait...'}
        />
      </IonContent>
    );
  }
  return isLoggedIn ? <Redirect to="/tabs" /> : <Redirect to="/login" />
};

export default connect<{}, StateProps, {}>({
  mapStateToProps: (state) => ({
    isLoggedIn: state.user.isLoggedIn
  }),
  component: HomeOrLogin
});

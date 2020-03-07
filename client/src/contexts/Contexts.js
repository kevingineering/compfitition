import React from 'react';

import GoalState from './goals/goalState';
import AlertState from './alerts/alertState';
import AuthState from './auth/authState';
import SearchableUsersState from './searchableUsers/searchableUsersState';
import RequestState from './requests/requestState';
import FriendState from './friends/friendState';
import CompetitionState from './competitions/competitionState';
import LetterState from './letters/letterState';

const Contexts = props => {

  console.log('Contexts')

  return (
    <AuthState>
      <AlertState>
        <GoalState>
          <FriendState>
            <SearchableUsersState>
              <RequestState>
                <CompetitionState>
                  <LetterState>
                    {props.children}
                  </LetterState>
                </CompetitionState>
              </RequestState>
            </SearchableUsersState>
          </FriendState>
        </GoalState>
      </AlertState>
    </AuthState>
  )
}

export default Contexts;
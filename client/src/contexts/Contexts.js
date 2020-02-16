import React from 'react';

import GoalState from './goals/goalState';
import AlertState from './alerts/alertState';
import AuthState from './auth/authState';
import SearchableUsersState from './searchableUsers/searchableUsersState';
import RequestState from './requests/requestState';
import FriendState from './friends/friendState';
import CompetitionState from './competitions/competitionState';
import InviteState from './invites/inviteState';

const Contexts = props => {
  return (
    <AuthState>
      <AlertState>
        <GoalState>
          <FriendState>
            <SearchableUsersState>
              <RequestState>
                <CompetitionState>
                  <InviteState>
                    {props.children}
                  </InviteState>
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
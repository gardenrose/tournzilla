import React from "react";
import { navigate } from "@reach/router";

export const positions = ['Goalkeeper', 'Right Full-back', 'Left Full-back',
'Centre-back', 'Centre-back Sweeper', 'Defensive Midfielder', 'Right Winger',
'Centre Midfielder', 'Centre-forward Striker', 'Attacking Midfielder', 'Left Winger'];

export const formations = ['4-2-3-1', '4-5-1', '4-4-2'];
export const genders = ['male','female'];

export const f4231 = {
  pos1: "Goalkeeper",
  pos2: "Right Full-back",
  pos3: "Centre Back",
  pos4: "Centre-back Sweeper",
  pos5: "Left Full-back",
  pos6: "Defensive Midfielder",
  pos7: "Defensive Midfielder",
  pos8: "Right Winger",
  pos9: "Attacking Midfielder",
  pos10: "Left Winger",
  pos11: "Centre-forward Striker",
};

export const f451 = {
  pos1: "Goalkeeper",
  pos2: "Right Full-back",
  pos3: "Centre Back",
  pos4: "Centre Back",
  pos5: "Left Full-back",
  pos6: "Right Winger",
  pos7: "Centre Midfielder",
  pos8: "Centre Midfielder",
  pos9: "Centre Midfielder",
  pos10: "Left Winger",
  pos11: "Attacking Midfielder",
};

export const f442 = {
  pos1: "Goalkeeper",
  pos2: "Right Full-back",
  pos3: "Centre Back",
  pos4: "Centre Back",
  pos5: "Left Full-back",
  pos6: "Right Winger",
  pos7: "Centre Midfielder",
  pos8: "Centre Midfielder",
  pos9: "Left Winger",
  pos10: "Centre-forward Striker",
  pos11: "Centre-forward Striker",
};

export function makeDefaultFormation(teamid) {
  const fd = new FormData();
  fd.append('teamid', teamid)
  fd.append('formationtype', '4-2-3-1')
  fd.append('jersey1', '')
  fd.append('jersey2', '')
  fd.append('jersey3', '')
  fd.append('jersey4', '')
  fd.append('jersey5', '')
  fd.append('jersey6', '')
  fd.append('jersey7', '')
  fd.append('jersey8', '')
  fd.append('jersey9', '')
  fd.append('jersey10', '')
  fd.append('jersey11', '')
  return fd
}

/*export function makeCustomFormation(teamid, players) {
  console.log(teamid)
  console.log(players)
  const fd = new FormData();
  let formedPlayers = []
  let jerseyNames = []
  for (const pos in f4231) {
    const formationPosition = f4231[pos];
    const availablePlayers = players?.filter(pl => pl.position === formationPosition && !formedPlayers.includes(pl.id))
    if (availablePlayers?.length > 0) {
      formedPlayers.push(availablePlayers[0]?.id)
      jerseyNames.push(availablePlayers[0]?.jerseynumber + " " + availablePlayers[0]?.jerseyname + " (preferred)")
    } else {
      const player = players?.filter(p => !formedPlayers.includes(p.id))[0]
      formedPlayers.push(player?.id)
      jerseyNames.push(player?.jerseynumber + " " + player?.jerseyname)
    }
  }
  fd.append('teamid', teamid)
  fd.append('position1', formedPlayers[0])
  fd.append('position2', formedPlayers[1])
  fd.append('position3', formedPlayers[2])
  fd.append('position4', formedPlayers[3])
  fd.append('position5', formedPlayers[4])
  fd.append('position6', formedPlayers[5])
  fd.append('position7', formedPlayers[6])
  fd.append('position8', formedPlayers[7])
  fd.append('position9', formedPlayers[8])
  fd.append('position10', formedPlayers[9])
  fd.append('position11', formedPlayers[10])
  fd.append('formationtype', '4-2-3-1')
  fd.append('jersey1', jerseyNames[0])
  fd.append('jersey2', jerseyNames[1])
  fd.append('jersey3', jerseyNames[2])
  fd.append('jersey4', jerseyNames[3])
  fd.append('jersey5', jerseyNames[4])
  fd.append('jersey6', jerseyNames[5])
  fd.append('jersey7', jerseyNames[6])
  fd.append('jersey8', jerseyNames[7])
  fd.append('jersey9', jerseyNames[8])
  fd.append('jersey10', jerseyNames[9])
  fd.append('jersey11', jerseyNames[10])
  return fd
}*/

export function makeCustomFormation(teamid, players) {
  console.log("teamid:", teamid);
  console.log("players:", players);

  const fd = new FormData();
  let formedPlayers = [];
  let jerseyNames = [];

  for (const pos in f4231) {
    const formationPosition = f4231[pos];
    const availablePlayers = players?.filter(pl => pl.position === formationPosition && !formedPlayers.includes(pl.id));
    if (availablePlayers?.length > 0) {
      formedPlayers.push(availablePlayers[0]?.id);
      jerseyNames.push(availablePlayers[0]?.jerseynumber + " " + availablePlayers[0]?.jerseyname + " (preferred)");
    } else {
      const player = players?.filter(p => !formedPlayers.includes(p.id))[0];
      formedPlayers.push(player?.id);
      jerseyNames.push(player?.jerseynumber + " " + player?.jerseyname);
    }
  }

  fd.append('teamid', teamid);
  fd.append('position1', formedPlayers[0]);
  fd.append('position2', formedPlayers[1]);
  fd.append('position3', formedPlayers[2]);
  fd.append('position4', formedPlayers[3]);
  fd.append('position5', formedPlayers[4]);
  fd.append('position6', formedPlayers[5]);
  fd.append('position7', formedPlayers[6]);
  fd.append('position8', formedPlayers[7]);
  fd.append('position9', formedPlayers[8]);
  fd.append('position10', formedPlayers[9]);
  fd.append('position11', formedPlayers[10]);
  fd.append('formationtype', '4-2-3-1');
  fd.append('jersey1', jerseyNames[0]);
  fd.append('jersey2', jerseyNames[1]);
  fd.append('jersey3', jerseyNames[2]);
  fd.append('jersey4', jerseyNames[3]);
  fd.append('jersey5', jerseyNames[4]);
  fd.append('jersey6', jerseyNames[5]);
  fd.append('jersey7', jerseyNames[6]);
  fd.append('jersey8', jerseyNames[7]);
  fd.append('jersey9', jerseyNames[8]);
  fd.append('jersey10', jerseyNames[9]);
  fd.append('jersey11', jerseyNames[10]);

  return fd;
}


export function updateCustomFormation(teamid, formationData, playerIDs, ftype) {
  const fd = new FormData();
  fd.append('teamid', teamid)
  fd.append('formationtype', ftype)
  fd.append('position1', playerIDs[0])
  fd.append('position2', playerIDs[1])
  fd.append('position3', playerIDs[2])
  fd.append('position4', playerIDs[3])
  fd.append('position5', playerIDs[4])
  fd.append('position6', playerIDs[5])
  fd.append('position7', playerIDs[6])
  fd.append('position8', playerIDs[7])
  fd.append('position9', playerIDs[8])
  fd.append('position10', playerIDs[9])
  fd.append('position11', playerIDs[10])
  fd.append('jersey1', formationData.jersey1)
  fd.append('jersey2', formationData.jersey2)
  fd.append('jersey3', formationData.jersey3)
  fd.append('jersey4', formationData.jersey4)
  fd.append('jersey5', formationData.jersey5)
  fd.append('jersey6', formationData.jersey6)
  fd.append('jersey7', formationData.jersey7)
  fd.append('jersey8', formationData.jersey8)
  fd.append('jersey9', formationData.jersey9)
  fd.append('jersey10', formationData.jersey10)
  fd.append('jersey11', formationData.jersey11)
  return fd
}

export const countries = ["🇦🇩 Andorra", "🇦🇪 UAE", "🇦🇫 Afganistan", "🇦🇱 Albania", "🇦🇲 Armenia", "🇦🇴 Angola",, "🇦🇶 Antarctica",
"🇦🇷 Argentina", "🇦🇹 Austria", "🇦🇺 Australia", "🇦🇿 Azerbaijan", "🇧🇦 Bosnia and Herzegovina", "🇧🇩 Bangladesh", "🇧🇪 Belgium",
"🇧🇬 Bulgaria", "🇧🇭 Bahrein", "🇧🇴 Bolivia", "🇧🇷 Brazil", "🇧🇸 Bahamas", "🇧🇼 Botswana", "🇧🇾 Belarus", "🇨🇦 Canada", "🇨🇬 Congo",
"🇨🇭 Switzerland", "🇨🇮 Cote D'ivoire", "🇨🇱 Chile", "🇨🇲 Cameroon", "🇨🇳 China", "🇨🇴 Colombia", "🇨🇷 Costa Rica", "🇨🇺 Cuba", "🇿🇲 Zambia",
"🇨🇾 Cyprus", "🇨🇿 Czechia", "🇩🇪 Germany", "🇩🇰 Denmark", "🇩🇴 Dominican Republic", "🇩🇿 Algeria", "🇪🇨 Ecuador", "🇪🇪 Estonia",
"🇪🇬 Egypt", "🇪🇸 Spain", "🇪🇹 Ethiopia", "🇫🇮 Finland", "🇫🇷 France", "🏴󠁧󠁢󠁥󠁮󠁧󠁿 England", "🇬🇲 Gambia", "🇬🇪 Georgia", "🇬🇭 Ghana", "🇬🇷 Greece",
"🇬🇹 Guatemala", "🇭🇰 Hong Kong", "🇭🇳 Honduras", "🇭🇷 Croatia", "🇭🇹 Haiti", "🇭🇺 Hungary", "🇮🇩 Indonesia", "🇮🇪 Ireland", "🇮🇱 Israel",
"🇮🇳 India", "🇮🇶 Iraq", "🇮🇷 Iran", "🇮🇸 Iceland", "🇮🇹 Italy", "🇯🇲 Jamaica", "🇯🇴 Jordan", "🇯🇵 Japan", "🇰🇪 Kenya", "🇰🇬 Kyrgyzstan",
"🇰🇭 Cambodia", "🇰🇵 North Korea", "🇰🇷 South Korea", "🇰🇼 Kuwait", "🇰🇿 Kazakhstan", "🇱🇦 Laos", "🇱🇧 Lebanon", "🇱🇮 Liechtenstein",
"🇱🇰 Sri Lanka", "🇱🇷 Liberia", "🇱🇹 Lithuania", "🇱🇺 Luxembourg", "🇱🇻 Latvia", "🇱🇾 Libya", "🇲🇦 Morocco", "🇲🇨 Monaco", "🇲🇩 Moldova",
"🇲🇪 Montenegro", "🇲🇬 Madagascar", "🇲🇰 North Macedonia", "🇲🇱 Mali", "🇲🇳 Mongolia", "🇲🇷 Mauritania", "🇲🇹 Malta", "🇲🇺 Mauritius",
"🇲🇻 Maldives", "🇲🇽 Mexico", "🇲🇾 Malaysia", "🇲🇿 Mozambique", "🇳🇬 Nigeria", "🇳🇱 Netherlands", "🇳🇴 Norway", "🇳🇵 Nepal", "🇳🇿 New Zealand",
"🇴🇲 Oman", "🇵🇪 Peru", "🇵🇭 Philippines", "🇵🇰 Pakistan", "🇵🇱 Poland", "🇵🇷 Puerto Rico", "🇵🇸 Palestine", "🇵🇹 Portugal", "🇵🇾 Paraguay",
"🇶🇦 Qatar", "🇷🇴 Romania", "🇷🇸 Serbia", "🇷🇺 Russia", "🇸🇦 Saudi Arabia", "🇸🇪 Sweden", "🇸🇬 Singapore", "🇸🇮 Slovenia", "🇸🇰 Slovakia",
"🇸🇳 Senegal", "🇸🇴 Somalia", "🇸🇾 Syria", "🇹🇩 Chad", "🇹🇬 Togo", "🇹🇭 Thailand", "🇹🇯 Tajikistan", "🇹🇳 Tunisia", "🇹🇷 Turkey", "🇹🇼 Taiwan",
"🇹🇹 Trinidad and Tobago", "🇹🇿 Tanzania", "🇺🇦 Ukraine", "🇺🇬 Uganda", "🇺🇸 USA", "🇺🇾 Uruguay", "🇺🇿 Uzbekistan", "🇻🇦 Vatican City",
"🇻🇪 Venezuela", "🇻🇳 Vietnam", "🇼🇸 Samoa", "🇾🇪 Yemen", "🇽🇰 Kosovo", "🇿🇦 South Africa", "🇿🇼 Zimbabwe", "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland", "🏴󠁧󠁢󠁷󠁬󠁳󠁿 Wales"];

export function visit(url) {
    React.useEffect(() => {
        navigate(url, { replace: true });
      }, []);
}

export function formatMarketValue(mv) {
  if (mv >= 1000000) {
    return (mv / 1000000).toFixed(1) + " m";
  } else if (mv >= 1000) {
    return (mv / 1000).toFixed(1) + " k";
  } else {
    return mv;
  }
}

export function formatTime(hours, minutes, seconds) {
  return hours + ":" + minutes + ":" + seconds
}

export function formatDateEU(dtStr) {
  const dt = new Date(dtStr)
  const mth = dt.getMonth()+1
  return dt.getDate() + "." + mth + "." + dt.getFullYear() + "."
}

export function occurencesInArray(number, arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === number) {
      count++;
    }
  }
  return count;
}

export function formatDateUS(dtStr) {
  const dt = new Date(dtStr)
  const mth = dt.getMonth()+1
  return dt.getFullYear() + "-" + ("0" + mth.toString()).slice(-2) + "-" + ( "0" + dt.getDate().toString()).slice(-2)
}

export function getAgeFromBday(birthday) {
  var bdayDateFormat=new Date(birthday);
  return birthday ? Math.floor((new Date() - bdayDateFormat) / 31536000000) : null;
}

export function getCountryWithFlag(country) {
  let foundCountry = null
  countries.map(x => {
    const flag = x.split(' ')[0];
    const countryName = x.split(flag + " ").join("");
    if (countryName === country){
      foundCountry = x
    }
  })
  return foundCountry ?? country
}

export function getCountryWithoutFlag(countryAndFlag) {
  const flag = countryAndFlag.split(' ')[0];
  return countryAndFlag.split(flag + " ").join("");
}

export function isPotentionOf2(x) {
  if (x <= 0) {
    return false;
  }
  return (x & (x - 1)) === 0;
}

export function extraPart(x) {
  if (isPotentionOf2(x)) {
    return 0
  } else {
    let count = 0
    while (!isPotentionOf2(x)) {
      x -= 1
      count +=1
    }
    return count
  }
}

export function addForHigherClosestPowerOf2(number) {
  let power = 0;
  while (Math.pow(2, power) < number) {
    power++;
  }
  return Math.pow(2, power) - number;
}

export const FIRST_HALF = 'First half';
export const HALVES_BREAK = 'Halftime break';
export const SECOND_HALF = 'Second half';
export const SECOND_BREAK = 'Second break';
export const THIRD_BREAK = 'Third break';
export const SECOND_EXTENSION = 'Second extension'
export const THIRD_EXTENSION = 'Third extension'
export const PENALTIES = 'Penalties'

export const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M","N",
"O","P","Q","R","S","T","U","V","W","X","Y","Z"]

export const circule = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'circule-light' :'circule';
export const newsText = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'news-text-light' :'news-text';
export const mainTitle = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'main-title-light' :'main-title';
export const newsComment = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'news-comment-light' :'news-comment';
export const matchesSpace = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'matches-space-light' :'matches-space';
export const termsCard = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'terms-card-light' :'terms-card';
export const blankspace = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'blankspace-light' :'blankspace';
export const termsTitle = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'terms-title-light' :'terms-title';
export const profileCard = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'profile-card-light' :'profile-card';
export const profileCard2 = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'profile-card2-light' :'profile-card2';
export const profileCard3 = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'profile-card3-light' :'profile-card3';
export const profileCard4 = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'profile-card4-light' :'profile-card4';
export const profileCount = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'profile-count-light' :'profile-count';
export const commentInput = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'comment-input-light' :'comment-input';
export const mainSubtitle = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'main-subtitle-light' :'main-subtitle';
export const playerNameLink = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'player-name-link-light' :'player-name-link';
export const tournamentBasic = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'tournament-basic-light' :'tournament-basic';
export const profileUsername = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'profile-username-light' :'profile-username';
export const playerStatsCard = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'player-stats-card-light' :'player-stats-card';
export const contactSubtitle = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'contact-subtitle-light' :'contact-subtitle';
export const profileBlankspace = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'profile-blankspace-light' :'profile-blankspace';
export const playerProfileTitles = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'player-profile-titles-light' :'player-profile-titles';
export const filterInput = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'filter-input-light' :'filter-input';
export const userNameLink = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'user-name-link-light' :'user-name-link';


// -------------------------- MODAL DIALOG --------------------------------

export const modalBtn = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'modal-btn-light' :'modal-btn';
export const modalTitle = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'modal-title-light' :'modal-title';
export const modalQuestion = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'modal-question-light' :'modal-question';
export const modalLabels = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'modal-labels-light' :'modal-labels';
export const modalLabelDesc = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'modal-label-desc-light' :'modal-label-desc';
export const modalInput = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'modal-input-light' :'modal-input';
export const modalDesc = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'modal-desc-light' :'modal-desc';
export const profileDialog = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'profile-dialog-light' :'profile-dialog';
export const factDialog = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'fact-dialog-light' :'fact-dialog';
export const calendarInput = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'calendar-input-light' :'calendar-input';
export const timesChampion = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'times-champion-light' :'times-champion';

// -------------------------- FORUM ---------------------------------------
export const forumIcons = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"forum-icons-light" : "forum-icons";
export const filterLabels = JSON.parse(window.localStorage.getItem('theme'))==="light" ?'filter-labels-light' :'filter-labels'
export const forumUserLink = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"forum-user-link-light" : "forum-user-link";

// -------------------------- CONTENT CARD --------------------------------
export const cardDesign = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"card-light" :"card";
export const cardTitle = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"card-title-light" : "card-title";
export const playerTeamName = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"player-team-name-light" : "player-team-name";
export const playerTeamPos = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"player-team-pos-light" : "player-team-pos";
export const cardDesc = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"card-desc-light" : "card-desc"
export const reportBox = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"report-box-light" : "report-box"
export const reportText = JSON.parse(window.localStorage.getItem('theme')) === "light" ? "report-item-text-light" : "report-item-text"

// -------------------------- GRAPHS -------------------------------------- 
export const stroke = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"#062d7f" :"gold";

// -------------------------- RANKING -------------------------------------
export const rankingCard = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"rank-btn-light" :"rank-btn";
export const rankHeading = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"rank-heading-light" :"rank-heading";

// -------------------------- LOGIN ---------------------------------------
export const loginArea = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"login-area-light" :"login-area";

// -------------------------- MATCH ---------------------------------------
export const opponentName = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"opponent-name-light" :"opponent-name";
export const opponentLabel = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"opponent-label-light" :"opponent-label";
export const scoreInput = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"score-input-light" :"score-input";
export const sideNumber = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"side-number-light" :"side-number";
export const matchSideStatsCard = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"match-side-light" :"match-side";
export const scoreChange = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"score-change-light" :"score-change";
export const activeMatchCard = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"active-match-light" :"active-match";
export const matchBackground = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"rgb(255,255,255)" :"rgb(0,0,0)";
export const matchPage = JSON.parse(window.localStorage.getItem('theme'))==="light" ?"white-page" :"black-page";

// ----------------------- MESSAGES FOR WRONG LOGIN INPUTS ----------------
export const emptyFieldMsg = 'No field should be empty.';
export const unknownErrorMsg = 'Unknown error. Please check your credentials and try again.';
export const registerSuccessMsg = 'Registered successfully. Check your mail for verification link.';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAIL = 'REGISTER_FAIL';
export const ACTIVATION_SUCCESS = 'ACTIVATION_SUCCESS';
export const ACTIVATION_FAIL = 'ACTIVATION_FAIL';
export const USER_LOADED_SUCCESS = 'USER_LOADED_SUCCESS';
export const USER_LOADED_FAIL = 'USER_LOADED_FAIL';
export const AUTHENTICATED_SUCCESS = 'AUTHENTICATED_SUCCESS';
export const AUTHENTICATED_FAIL = 'AUTHENTICATED_FAIL';
export const PASSWORD_RESET_FAIL = 'PASSWORD_RESET_FAIL';
export const PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS';
export const PASSWORD_RESET_CONFIRM_FAIL = 'PASSWORD_RESET_CONFIRM_FAIL';
export const PASSWORD_RESET_CONFIRM_SUCCESS = 'PASSWORD_RESET_CONFIRM_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const EMPTY_FIELDS = 'EMPTY_FIELDS';

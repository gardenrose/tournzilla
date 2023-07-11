import { FIRST_HALF, HALVES_BREAK, PENALTIES, SECOND_BREAK, SECOND_EXTENSION, SECOND_HALF, THIRD_BREAK, THIRD_EXTENSION, formatDateEU, makeCustomFormation, updateCustomFormation } from "./Constants";

export function tournamentDecider (tournamentID) {
    const fd = new FormData()
    fetch(`/api/tournaments/${tournamentID}/`)
    .then(tRes => tRes.json())
    .then(tData => {
        if (new Date() >= new Date(tData.startDate) && new Date() <= new Date(tData.endDate)) {
            fd.append('status', 'In progress')
            fetch(`/api/tournaments/${tournamentID}/`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: fd
            })
        } else if (new Date() >= new Date(tData.endDate)) {
            fd.append('status', 'Finished')
            fetch(`/api/tournaments/${tournamentID}/`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: fd
            })
        }
    })
}

export function singleMatchDecider1(tournament, match) {
    let label = formatDateEU(match.matchdate) + " at " + match.starttime + " GMT+0200"
    if (match.endedearlier) {
        label = "Played " +  formatDateEU(match.matchdate) + " at " + match.starttime + " GMT+0200"

        // igra se prvo poluvrijeme, tj pocelo je
    } else if (new Date() >= new Date(match.matchdate + "T" + match.starttime) && new Date() < new Date(new Date(match.matchdate+"T"+match.starttime).getTime() +(45 * 60000))) { 
        label = FIRST_HALF
        if (match.status === 'Not started') {
            const startFD = new FormData()
            startFD.append('status', 'In progress')
            fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.matchid}/`, {
                method:"put",
                headers: { 
                  'Authorization': `JWT ${localStorage.getItem('access')}`
              }, body: startFD
            })
        }
    
        // pauza 15 min izmedju poluvrimena
    } else if (new Date() >= new Date(new Date(match.matchdate+"T"+match.starttime).getTime() +(45 * 60000)) && new Date() < new Date(new Date(match.matchdate+"T"+match.starttime).getTime() +(60 * 60000)))  {
        label = HALVES_BREAK

        // drugo poluvrijeme + sudacke nadoknade
    } else if (new Date() >= new Date(new Date(match.matchdate+"T"+match.starttime).getTime() +(60 * 60000)) && new Date() < new Date(new Date(match.matchdate+"T"+match.starttime).getTime() +((105 + parseInt(match.extension)) * 60000))) {
        label = SECOND_HALF

        // ovo je specificno, poslje poluvremena i nadoknada grupne utakmice zavrsavaju, 
        // a eliminacijske samo ako ima pobjednika
        // ako nema onda se pravi pauza od 5 min, pa se dalje igra po pravilima ispod
    } else if (new Date() >= new Date(new Date(match.matchdate+"T"+match.starttime).getTime() +((105 + parseInt(match.extension)) * 60000)) && new Date() < new Date(new Date(match.matchdate+"T"+match.starttime).getTime() +((110 + parseInt(match.extension)) * 60000))) {
        if (match.groupid) {
            let winner = null
            const groupEndFD = new FormData()
            if (match.score1 > match.score2) {
                winner = match.team1
                groupEndFD.append('winner', match.team1)
            } else if (match.score2 > match.score1) {
                winner = match.team2
                groupEndFD.append('winner', match.team2)
            }
            groupEndFD.append('status', 'Finished')
            fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.matchid}/`, {
                method:"put",
                headers: { 
                  'Authorization': `JWT ${localStorage.getItem('access')}`
                }, body: groupEndFD
              })
            if (!tournament.friendly) {
                fetch(`/api/teams/${match.team1}/`)
                .then(res => res.json())
                .then(team1 => {
                    fetch(`/api/teams/${match.team2}/`)
                    .then(res2 => res2.json())
                    .then(team2 => {
                        winnerTeam = winner === match.team1 ? team1 : winner === match.team2 ? team2 : null;
                        calculateEloRating(team1, team2, winner)
                        calculateEloRating(team2, team1, winner)
                    })
                })
            }
            label = "Played " +  formatDateEU(match.matchdate) + " at " + match.starttime + " GMT+0200"

        } else {
            if (!match.winner) {
                let winner = null
                let secondplace = null
                if (match.score1 > match.score2) {
                    winner = match.team1
                    secondplace = match.team2
                } else if (match.score2 > match.score1) {
                    winner = match.team2
                    secondplace = match.team1
                }
                // ako nije izjednaceno
                if (winner) {
                    const eliminationFD = new FormData()
                    eliminationFD.append('winner', winner)
                    eliminationFD.append('status', 'Finished')
                    fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.matchid}/`, {
                        method:"put",
                        headers: { 
                          'Authorization': `JWT ${localStorage.getItem('access')}`
                        }, body: eliminationFD
                    })

                    // ako je finalna
                    if (!match.nextmatchid) {
                        const finalFD = new FormData()
                        finalFD.append('winner', winner)
                        finalFD.append('secondplace', secondplace)
                        fetch(`/api/tournaments/${tournament.championshipid}/`, {
                            method:"put",
                            headers: { 
                                'Authorization': `JWT ${localStorage.getItem('access')}`
                            }, body: finalFD
                        })
                    
                    // ako je za 3.misto
                    } else if (match.matchid === detectThirdAndForthPlace(match.championshipid)) {
                        announceThirdPlace(match.matchid)

                    // ako je jedna od dvije prije utakmice za 3.misto
                    } else if (detectMatchesBeforeThird(match.championshipid)?.includes(match.matchid)) {
                        const nextFormData = new FormData()
                        const nextNextFormData = new FormData()
                        fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.nextmatchid}/`)
                        .then(rsp => rsp.json())
                        .then(dataa => {
                            if (dataa.team1 === 500 && dataa.team2 !== secondplace) {
                                nextFormData.append('team1', secondplace)
                                if (dataa.team2 !== 500) {
                                    fetch(`/api/teams/${dataa.team2}/`)
                                    .then(respo => respo.json())
                                    .then(tm1 => {
                                        fetch(`/api/teams/${secondplace}/`)
                                        .then(respo => respo.json())
                                        .then(tm2 => {
                                            fetch(`/api/refereeing/${dataa.matchdate}/`)
                                            .then(rs => rs.json())
                                            .then(data => {
                                                const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                                if (referees.length > 0) {
                                                const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                                nextFormData.append('referee', randomReferee.name)
                                                fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                                    method: 'PUT',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: nextFormData
                                                })
                                                fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                                    method: 'POST',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: JSON.stringify({"referee":randomReferee.name})
                                                })
                                                }
                                            })
                                            fetch(`/api/formations/${match.nextmatchid}/`)
                                            .then(rspp => rspp.json())
                                            .then(formationss => {
                                                let frm = formationss[0]
                                                if (frm) {
                                                    fetch(`/api/players/`)
                                                    .then(res => res.json())
                                                    .then(teamPlayers => {
                                                        fetch(`/api/redcards/${match.championshipid}/`)
                                                        .then(resp => resp.json())
                                                        .then(reds => {
                                                            const redGetters = reds.filter(x => x.team === secondplace).map(red => red.playerid);
                                                            console.log(redGetters)
                                                            let tmPlayers = teamPlayers.filter(pl => pl.currentteam === secondplace)
                                                            const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                            //return filteredPlayers
                                                            fetch(`/api/formations/${match.nextmatchid}/${frm.id}/`, {
                                                                method:"put",
                                                                headers: { 
                                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                                }, 
                                                                body: makeCustomFormation(secondplace, filteredPlayers)
                                                            })
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    })
                                }
            
                            } else if (dataa.team2 === 500 && dataa.team1 !== winner) {
                                nextFormData.append('team2', winner)
                                if (dataa.team1 !== 500) {
                                    fetch(`/api/teams/${dataa.team1}/`)
                                    .then(respo => respo.json())
                                    .then(tm1 => {
                                        fetch(`/api/teams/${winner}/`)
                                        .then(respo => respo.json())
                                        .then(tm2 => {
                                            fetch(`/api/refereeing/${dataa.matchdate}/`)
                                            .then(rs => rs.json())
                                            .then(data => {
                                                const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                                if (referees.length > 0) {
                                                const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                                nextFormData.append('referee', randomReferee.name)
                                                fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                                    method: 'PUT',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: nextFormData
                                                })
                                                fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                                    method: 'POST',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: JSON.stringify({"referee":randomReferee.name})
                                                })
                                                }
                                            })
                                            fetch(`/api/formations/${match.nextmatchid}/`)
                                            .then(rspp => rspp.json())
                                            .then(formationss => {
                                                let frm = formationss[1]
                                                if (frm) {
                                                    fetch(`/api/players/`)
                                                    .then(res => res.json())
                                                    .then(teamPlayers => {
                                                        fetch(`/api/redcards/${match.championshipid}/`)
                                                        .then(resp => resp.json())
                                                        .then(reds => {
                                                            const redGetters = reds.filter(x => x.team === winner).map(red => red.playerid);
                                                            console.log(redGetters)
                                                            let tmPlayers = teamPlayers.filter(pl => pl.currentteam === winner)
                                                            const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                            //return filteredPlayers
                                                            fetch(`/api/formations/${match.nextmatchid}/${frm.id}/`, {
                                                                method:"put",
                                                                headers: { 
                                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                                }, 
                                                                body: makeCustomFormation(winner, filteredPlayers)
                                                            })
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    })
                                }
                            }
                        })
            
                        fetch(`/api/tournaments/${tournament.championshipid}/matches/${parseInt(match.nextmatchid)+1}/`)
                        .then(rsp => rsp.json())
                        .then(dataa => {
                            if (dataa.team1 === 500 && dataa.team2 !== winner) {
                                nextNextFormData.append('team1', winner)
                                if (dataa.team2 !== 500) {
                                    fetch(`/api/teams/${dataa.team2}/`)
                                    .then(respo => respo.json())
                                    .then(tm1 => {
                                        fetch(`/api/teams/${winner}/`)
                                        .then(respo => respo.json())
                                        .then(tm2 => {
                                            fetch(`/api/refereeing/${dataa.matchdate}/`)
                                            .then(rs => rs.json())
                                            .then(data => {
                                                const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                                if (referees.length > 0) {
                                                const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                                nextNextFormData.append('referee', randomReferee.name)
                                                fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                                    method: 'PUT',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: nextNextFormData
                                                })
                                                fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                                    method: 'POST',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: JSON.stringify({"referee":randomReferee.name})
                                                })
                                                }
                                            })
                                            fetch(`/api/formations/${parseInt(match.nextmatchid)+1}/`)
                                            .then(rspp => rspp.json())
                                            .then(formationss => {
                                                let frm = formationss[0]
                                                if (frm) {
                                                    fetch(`/api/players/`)
                                                    .then(res => res.json())
                                                    .then(teamPlayers => {
                                                        fetch(`/api/redcards/${match.championshipid}/`)
                                                        .then(resp => resp.json())
                                                        .then(reds => {
                                                            const redGetters = reds.filter(x => x.team === winner).map(red => red.playerid);
                                                            console.log(redGetters)
                                                            let tmPlayers = teamPlayers.filter(pl => pl.currentteam === winner)
                                                            const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                            //return filteredPlayers
                                                            fetch(`/api/formations/${parseInt(match.nextmatchid)+1}/${frm.id}/`, {
                                                                method:"put",
                                                                headers: { 
                                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                                }, 
                                                                body: makeCustomFormation(winner, filteredPlayers)
                                                            })
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    })
                                }
            
                            } else if (dataa.team2 === 500 && dataa.team1 !== winner) {
                                nextNextFormData.append('team2', winner)
                                if (dataa.team1 !== 500) {
                                    fetch(`/api/teams/${dataa.team1}/`)
                                    .then(respo => respo.json())
                                    .then(tm1 => {
                                        fetch(`/api/teams/${winner}/`)
                                        .then(respo => respo.json())
                                        .then(tm2 => {
                                            fetch(`/api/refereeing/${dataa.matchdate}/`)
                                            .then(rs => rs.json())
                                            .then(data => {
                                                const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                                if (referees.length > 0) {
                                                const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                                nextNextFormData.append('referee', randomReferee.name)
                                                fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                                    method: 'PUT',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: nextNextFormData
                                                })
                                                fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                                    method: 'POST',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: JSON.stringify({"referee":randomReferee.name})
                                                })
                                                }
                                            })
                                            fetch(`/api/formations/${parseInt(match.nextmatchid)+1}/`)
                                            .then(rspp => rspp.json())
                                            .then(formationss => {
                                                let frm = formationss[1]
                                                if (frm) {
                                                    fetch(`/api/players/`)
                                                    .then(res => res.json())
                                                    .then(teamPlayers => {
                                                        fetch(`/api/redcards/${match.championshipid}/`)
                                                        .then(resp => resp.json())
                                                        .then(reds => {
                                                            const redGetters = reds.filter(x => x.team === winner).map(red => red.playerid);
                                                            console.log(redGetters)
                                                            let tmPlayers = teamPlayers.filter(pl => pl.currentteam === winner)
                                                            const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                            //return filteredPlayers
                                                            fetch(`/api/formations/${parseInt(match.nextmatchid)+1}/${frm.id}/`, {
                                                                method:"put",
                                                                headers: { 
                                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                                }, 
                                                                body: makeCustomFormation(winner, filteredPlayers)
                                                            })
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    })
                                }
                            }
                        })
            
            
                    }

                    if (!match.nextmatchid) {
                        const finalFD = new FormData()
                        finalFD.append('winner', winner)
                        finalFD.append('secondplace', secondplace)
                        fetch(`/api/tournaments/${tournament.championshipid}/`, {
                            method:"put",
                            headers: { 
                                'Authorization': `JWT ${localStorage.getItem('access')}`
                            }, body: finalFD
                        })
                    } else {
                        const nextMatchFD = new FormData()
                        fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.nextmatchid}/`)
                        .then(nextRes => nextRes.json())
                        .then(nextMtchData => {
                            if (nextMtchData.team1 === 500 && nextMtchData.team2 !== winner) {
                                nextMatchFD.append('team1', winner)
                              } else if (nextMtchData.team2 === 500 && nextMtchData.team1 !== winner) {
                                nextMatchFD.append('team2', winner)
                              }
                              fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.nextmatchid}/`, {
                                method:"put",
                                headers: { 
                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                }, body: nextMatchFD
                            })
                        })
                    }
                    label = "Played " +  formatDateEU(match.matchdate) + " at " + match.starttime + " GMT+0200"
                } else {
                    label = SECOND_BREAK;
                }
            } else {
                label = "Played " +  formatDateEU(match.matchdate) + " at " + match.starttime + " GMT+0200"
            }
            
        }
    } //nakon tih 5min odmora igra se 15
    else if (new Date() >= new Date(new Date(match.matchdate+"T"+match.starttime).getTime() +((110 + parseInt(match.extension)) * 60000)) && new Date() < new Date(new Date(match.matchdate+"T"+match.starttime).getTime() +((125 + parseInt(match.extension)) * 60000))) {
        if (!match.winner && !match.groupid) {
            label = SECOND_EXTENSION
        } else {
            label = "Played " +  formatDateEU(match.matchdate) + " at " + match.starttime + " GMT+0200"
        }
    } else if (new Date() >= new Date(new Date(match.matchdate+"T"+match.starttime).getTime() +((125 + parseInt(match.extension)) * 60000)) && new Date() < new Date(new Date(match.matchdate+"T"+match.starttime).getTime() +((130 + parseInt(match.extension)) * 60000))) {
        if (!match.winner && !match.groupid) {
            label = THIRD_BREAK
        } else {
            label = "Played " +  formatDateEU(match.matchdate) + " at " + match.starttime + " GMT+0200"
        }
    } else if (new Date() >= new Date(new Date(match.matchdate+"T"+match.starttime).getTime() +((130 + parseInt(match.extension)) * 60000)) && new Date() < new Date(new Date(match.matchdate+"T"+match.starttime).getTime() +((145 + parseInt(match.extension)) * 60000))) {
        if (!match.winner && !match.groupid) {
            label = THIRD_EXTENSION
        } else {
            label = "Played " +  formatDateEU(match.matchdate) + " at " + match.starttime + " GMT+0200"
        }
        // ako ima pobjednika zavrsava se eliminacijska utakmica
        // ako nema, igraju se penali
    } else if (new Date() >= new Date(new Date(match.matchdate+"T"+match.starttime).getTime() +((145 + parseInt(match.extension)) * 60000)) && new Date() < new Date(new Date(match.matchdate+"T"+match.starttime).getTime() + 24 * 60 * 60000)) {
        if (!match.winner && !match.groupid) {
            if (!match.winner) {
                let winner = null
                let secondplace = null
                if (match.score1 > match.score2) {
                    winner = match.team1
                    secondplace = match.team2
                } else if (match.score2 > match.score1) {
                    winner = match.team2
                    secondplace = match.team1
                }
                // ako nije izjednaceno
                if (winner) {
                    const eliminationFD = new FormData()
                    eliminationFD.append('winner', winner)
                    eliminationFD.append('status', 'Finished')
                    fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.matchid}/`, {
                        method:"put",
                        headers: { 
                          'Authorization': `JWT ${localStorage.getItem('access')}`
                        }, body: eliminationFD
                    })

                    // ako je finalna

                    console.log(detectMatchesBeforeThird(match.championshipid))
                    if (!match.nextmatchid) {
                        const finalFD = new FormData()
                        finalFD.append('winner', winner)
                        finalFD.append('secondplace', secondplace)
                        fetch(`/api/tournaments/${tournament.championshipid}/`, {
                            method:"put",
                            headers: { 
                                'Authorization': `JWT ${localStorage.getItem('access')}`
                            }, body: finalFD
                        })
                    
                    // ako je za 3.misto
                    } else if (match.matchid === detectThirdAndForthPlace(match.championshipid)) {
                        announceThirdPlace(match.matchid)

                    // ako je jedna od dvije prije utakmice za 3.misto
                    }
                    else if (detectMatchesBeforeThird(match.championshipid)?.includes(match.matchid)) {
                        const nextFormData = new FormData()
                        const nextNextFormData = new FormData()
                        fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.nextmatchid}/`)
                        .then(rsp => rsp.json())
                        .then(dataa => {
                            if (dataa.team1 === 500 && dataa.team2 !== secondplace) {
                                nextFormData.append('team1', secondplace)
                                if (dataa.team2 !== 500) {
                                    fetch(`/api/teams/${dataa.team2}/`)
                                    .then(respo => respo.json())
                                    .then(tm1 => {
                                        fetch(`/api/teams/${secondplace}/`)
                                        .then(respo => respo.json())
                                        .then(tm2 => {
                                            fetch(`/api/refereeing/${dataa.matchdate}/`)
                                            .then(rs => rs.json())
                                            .then(data => {
                                                const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                                if (referees.length > 0) {
                                                const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                                nextFormData.append('referee', randomReferee.name)
                                                fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                                    method: 'PUT',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: nextFormData
                                                })
                                                fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                                    method: 'POST',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: JSON.stringify({"referee":randomReferee.name})
                                                })
                                                }
                                            })
                                            fetch(`/api/formations/${match.nextmatchid}/`)
                                            .then(rspp => rspp.json())
                                            .then(formationss => {
                                                let frm = formationss[0]
                                                if (frm) {
                                                    fetch(`/api/players/`)
                                                    .then(res => res.json())
                                                    .then(teamPlayers => {
                                                        fetch(`/api/redcards/${match.championshipid}/`)
                                                        .then(resp => resp.json())
                                                        .then(reds => {
                                                            const redGetters = reds.filter(x => x.team === secondplace).map(red => red.playerid);
                                                            console.log(redGetters)
                                                            let tmPlayers = teamPlayers.filter(pl => pl.currentteam === secondplace)
                                                            const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                            //return filteredPlayers
                                                            fetch(`/api/formations/${match.nextmatchid}/${frm.id}/`, {
                                                                method:"put",
                                                                headers: { 
                                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                                }, 
                                                                body: makeCustomFormation(secondplace, filteredPlayers)
                                                            })
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    })
                                }
            
                            } else if (dataa.team2 === 500 && dataa.team1 !== winner) {
                                nextFormData.append('team2', winner)
                                if (dataa.team1 !== 500) {
                                    fetch(`/api/teams/${dataa.team1}/`)
                                    .then(respo => respo.json())
                                    .then(tm1 => {
                                        fetch(`/api/teams/${winner}/`)
                                        .then(respo => respo.json())
                                        .then(tm2 => {
                                            fetch(`/api/refereeing/${dataa.matchdate}/`)
                                            .then(rs => rs.json())
                                            .then(data => {
                                                const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                                if (referees.length > 0) {
                                                const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                                nextFormData.append('referee', randomReferee.name)
                                                fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                                    method: 'PUT',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: nextFormData
                                                })
                                                fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                                    method: 'POST',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: JSON.stringify({"referee":randomReferee.name})
                                                })
                                                }
                                            })
                                            fetch(`/api/formations/${match.nextmatchid}/`)
                                            .then(rspp => rspp.json())
                                            .then(formationss => {
                                                let frm = formationss[1]
                                                if (frm) {
                                                    fetch(`/api/players/`)
                                                    .then(res => res.json())
                                                    .then(teamPlayers => {
                                                        fetch(`/api/redcards/${match.championshipid}/`)
                                                        .then(resp => resp.json())
                                                        .then(reds => {
                                                            const redGetters = reds.filter(x => x.team === winner).map(red => red.playerid);
                                                            console.log(redGetters)
                                                            let tmPlayers = teamPlayers.filter(pl => pl.currentteam === winner)
                                                            const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                            //return filteredPlayers
                                                            fetch(`/api/formations/${match.nextmatchid}/${frm.id}/`, {
                                                                method:"put",
                                                                headers: { 
                                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                                }, 
                                                                body: makeCustomFormation(winner, filteredPlayers)
                                                            })
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    })
                                }
                            }
                        })
            
                        fetch(`/api/tournaments/${tournament.championshipid}/matches/${parseInt(match.nextmatchid)+1}/`)
                        .then(rsp => rsp.json())
                        .then(dataa => {
                            if (dataa.team1 === 500 && dataa.team2 !== winner) {
                                nextNextFormData.append('team1', winner)
                                if (dataa.team2 !== 500) {
                                    fetch(`/api/teams/${dataa.team2}/`)
                                    .then(respo => respo.json())
                                    .then(tm1 => {
                                        fetch(`/api/teams/${winner}/`)
                                        .then(respo => respo.json())
                                        .then(tm2 => {
                                            fetch(`/api/refereeing/${dataa.matchdate}/`)
                                            .then(rs => rs.json())
                                            .then(data => {
                                                const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                                if (referees.length > 0) {
                                                const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                                nextNextFormData.append('referee', randomReferee.name)
                                                fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                                    method: 'PUT',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: nextNextFormData
                                                })
                                                fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                                    method: 'POST',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: JSON.stringify({"referee":randomReferee.name})
                                                })
                                                }
                                            })
                                            fetch(`/api/formations/${parseInt(match.nextmatchid)+1}/`)
                                            .then(rspp => rspp.json())
                                            .then(formationss => {
                                                let frm = formationss[0]
                                                if (frm) {
                                                    fetch(`/api/players/`)
                                                    .then(res => res.json())
                                                    .then(teamPlayers => {
                                                        fetch(`/api/redcards/${match.championshipid}/`)
                                                        .then(resp => resp.json())
                                                        .then(reds => {
                                                            const redGetters = reds.filter(x => x.team === winner).map(red => red.playerid);
                                                            console.log(redGetters)
                                                            let tmPlayers = teamPlayers.filter(pl => pl.currentteam === winner)
                                                            const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                            //return filteredPlayers
                                                            fetch(`/api/formations/${parseInt(match.nextmatchid)+1}/${frm.id}/`, {
                                                                method:"put",
                                                                headers: { 
                                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                                }, 
                                                                body: makeCustomFormation(winner, filteredPlayers)
                                                            })
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    })
                                }
            
                            } else if (dataa.team2 === 500 && dataa.team1 !== winner) {
                                nextNextFormData.append('team2', winner)
                                if (dataa.team1 !== 500) {
                                    fetch(`/api/teams/${dataa.team1}/`)
                                    .then(respo => respo.json())
                                    .then(tm1 => {
                                        fetch(`/api/teams/${winner}/`)
                                        .then(respo => respo.json())
                                        .then(tm2 => {
                                            fetch(`/api/refereeing/${dataa.matchdate}/`)
                                            .then(rs => rs.json())
                                            .then(data => {
                                                const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                                if (referees.length > 0) {
                                                const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                                nextNextFormData.append('referee', randomReferee.name)
                                                fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                                    method: 'PUT',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: nextNextFormData
                                                })
                                                fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                                    method: 'POST',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: JSON.stringify({"referee":randomReferee.name})
                                                })
                                                }
                                            })
                                            fetch(`/api/formations/${parseInt(match.nextmatchid)+1}/`)
                                            .then(rspp => rspp.json())
                                            .then(formationss => {
                                                let frm = formationss[1]
                                                if (frm) {
                                                    fetch(`/api/players/`)
                                                    .then(res => res.json())
                                                    .then(teamPlayers => {
                                                        fetch(`/api/redcards/${match.championshipid}/`)
                                                        .then(resp => resp.json())
                                                        .then(reds => {
                                                            const redGetters = reds.filter(x => x.team === winner).map(red => red.playerid);
                                                            console.log(redGetters)
                                                            let tmPlayers = teamPlayers.filter(pl => pl.currentteam === winner)
                                                            const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                            //return filteredPlayers
                                                            fetch(`/api/formations/${parseInt(match.nextmatchid)+1}/${frm.id}/`, {
                                                                method:"put",
                                                                headers: { 
                                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                                }, 
                                                                body: makeCustomFormation(winner, filteredPlayers)
                                                            })
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    })
                                }
                            }
                        })
            
            
                    }

                    if (!match.nextmatchid) {
                        const finalFD = new FormData()
                        finalFD.append('winner', winner)
                        finalFD.append('secondplace', secondplace)
                        fetch(`/api/tournaments/${tournament.championshipid}/`, {
                            method:"put",
                            headers: { 
                                'Authorization': `JWT ${localStorage.getItem('access')}`
                            }, body: finalFD
                        })
                    } else {
                        const nextMatchFD = new FormData()
                        fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.nextmatchid}/`)
                        .then(nextRes => nextRes.json())
                        .then(nextMtchData => {
                            if (nextMtchData.team1 === 500 && nextMtchData.team2 !== winner) {
                                nextMatchFD.append('team1', winner)
                              } else if (nextMtchData.team2 === 500 && nextMtchData.team1 !== winner) {
                                nextMatchFD.append('team2', winner)
                              }
                              fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.nextmatchid}/`, {
                                method:"put",
                                headers: { 
                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                }, body: nextMatchFD
                            })
                        })
                    }
                    label = "Played " +  formatDateEU(match.matchdate) + " at " + match.starttime + " GMT+0200"
                } else {
                    label = PENALTIES;
                }
            }
        } else {
            label = "Played " +  formatDateEU(match.matchdate) + " at " + match.starttime + " GMT+0200"
        }
    } else if (new Date() > new Date(new Date(match.matchdate+"T"+match.starttime).getTime() + 24 * 60 * 60000)) {
        // ako je proslo vise od 24h od utakmice i nema pobjednika
        // pobjeda se dodjeljuje prvom timu
        if (!match.winner && !match.groupid) {
            if (!match.winner) {
                let winner = match.team1
                let secondplace = match.team2
                // ako nije izjednaceno
                if (winner) {
                    const eliminationFD = new FormData()
                    eliminationFD.append('winner', winner)
                    eliminationFD.append('score1', score1 + 1)
                    eliminationFD.append('status', 'Finished')
                    fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.matchid}/`, {
                        method:"put",
                        headers: { 
                            'Authorization': `JWT ${localStorage.getItem('access')}`
                        }, body: eliminationFD
                    })

                    // ako je finalna
                    if (!match.nextmatchid) {
                        const finalFD = new FormData()
                        finalFD.append('winner', winner)
                        finalFD.append('secondplace', secondplace)
                        fetch(`/api/tournaments/${tournament.championshipid}/`, {
                            method:"put",
                            headers: { 
                                'Authorization': `JWT ${localStorage.getItem('access')}`
                            }, body: finalFD
                        })
                    
                    // ako je za 3.misto
                    } else if (match.matchid === detectThirdAndForthPlace(match.championshipid)) {
                        announceThirdPlace(match.matchid)

                    // ako je jedna od dvije prije utakmice za 3.misto
                    } else if (detectMatchesBeforeThird(match.championshipid)?.includes(match.matchid)) {
                        const nextFormData = new FormData()
                        const nextNextFormData = new FormData()
                        fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.nextmatchid}/`)
                        .then(rsp => rsp.json())
                        .then(dataa => {
                            if (dataa.team1 === 500 && dataa.team2 !== secondplace) {
                                nextFormData.append('team1', secondplace)
                                if (dataa.team2 !== 500) {
                                    fetch(`/api/teams/${dataa.team2}/`)
                                    .then(respo => respo.json())
                                    .then(tm1 => {
                                        fetch(`/api/teams/${secondplace}/`)
                                        .then(respo => respo.json())
                                        .then(tm2 => {
                                            fetch(`/api/refereeing/${dataa.matchdate}/`)
                                            .then(rs => rs.json())
                                            .then(data => {
                                                const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                                if (referees.length > 0) {
                                                const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                                nextFormData.append('referee', randomReferee.name)
                                                fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                                    method: 'PUT',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: nextFormData
                                                })
                                                fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                                    method: 'POST',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: JSON.stringify({"referee":randomReferee.name})
                                                })
                                                }
                                            })
                                            fetch(`/api/formations/${match.nextmatchid}/`)
                                            .then(rspp => rspp.json())
                                            .then(formationss => {
                                                let frm = formationss[0]
                                                if (frm) {
                                                    fetch(`/api/players/`)
                                                    .then(res => res.json())
                                                    .then(teamPlayers => {
                                                        fetch(`/api/redcards/${match.championshipid}/`)
                                                        .then(resp => resp.json())
                                                        .then(reds => {
                                                            const redGetters = reds.filter(x => x.team === secondplace).map(red => red.playerid);
                                                            console.log(redGetters)
                                                            let tmPlayers = teamPlayers.filter(pl => pl.currentteam === secondplace)
                                                            const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                            //return filteredPlayers
                                                            fetch(`/api/formations/${match.nextmatchid}/${frm.id}/`, {
                                                                method:"put",
                                                                headers: { 
                                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                                }, 
                                                                body: makeCustomFormation(secondplace, filteredPlayers)
                                                            })
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    })
                                }
            
                            } else if (dataa.team2 === 500 && dataa.team1 !== winner) {
                                nextFormData.append('team2', winner)
                                if (dataa.team1 !== 500) {
                                    fetch(`/api/teams/${dataa.team1}/`)
                                    .then(respo => respo.json())
                                    .then(tm1 => {
                                        fetch(`/api/teams/${winner}/`)
                                        .then(respo => respo.json())
                                        .then(tm2 => {
                                            fetch(`/api/refereeing/${dataa.matchdate}/`)
                                            .then(rs => rs.json())
                                            .then(data => {
                                                const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                                if (referees.length > 0) {
                                                const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                                nextFormData.append('referee', randomReferee.name)
                                                fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                                    method: 'PUT',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: nextFormData
                                                })
                                                fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                                    method: 'POST',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: JSON.stringify({"referee":randomReferee.name})
                                                })
                                                }
                                            })
                                            fetch(`/api/formations/${match.nextmatchid}/`)
                                            .then(rspp => rspp.json())
                                            .then(formationss => {
                                                let frm = formationss[1]
                                                if (frm) {
                                                    fetch(`/api/players/`)
                                                    .then(res => res.json())
                                                    .then(teamPlayers => {
                                                        fetch(`/api/redcards/${match.championshipid}/`)
                                                        .then(resp => resp.json())
                                                        .then(reds => {
                                                            const redGetters = reds.filter(x => x.team === winner).map(red => red.playerid);
                                                            console.log(redGetters)
                                                            let tmPlayers = teamPlayers.filter(pl => pl.currentteam === winner)
                                                            const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                            //return filteredPlayers
                                                            fetch(`/api/formations/${match.nextmatchid}/${frm.id}/`, {
                                                                method:"put",
                                                                headers: { 
                                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                                }, 
                                                                body: makeCustomFormation(winner, filteredPlayers)
                                                            })
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    })
                                }
                            }
                        })
            
                        fetch(`/api/tournaments/${tournament.championshipid}/matches/${parseInt(match.nextmatchid)+1}/`)
                        .then(rsp => rsp.json())
                        .then(dataa => {
                            if (dataa.team1 === 500 && dataa.team2 !== winner) {
                                nextNextFormData.append('team1', winner)
                                if (dataa.team2 !== 500) {
                                    fetch(`/api/teams/${dataa.team2}/`)
                                    .then(respo => respo.json())
                                    .then(tm1 => {
                                        fetch(`/api/teams/${winner}/`)
                                        .then(respo => respo.json())
                                        .then(tm2 => {
                                            fetch(`/api/refereeing/${dataa.matchdate}/`)
                                            .then(rs => rs.json())
                                            .then(data => {
                                                const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                                if (referees.length > 0) {
                                                const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                                nextNextFormData.append('referee', randomReferee.name)
                                                fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                                    method: 'PUT',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: nextNextFormData
                                                })
                                                fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                                    method: 'POST',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: JSON.stringify({"referee":randomReferee.name})
                                                })
                                                }
                                            })
                                            fetch(`/api/formations/${parseInt(match.nextmatchid)+1}/`)
                                            .then(rspp => rspp.json())
                                            .then(formationss => {
                                                let frm = formationss[0]
                                                if (frm) {
                                                    fetch(`/api/players/`)
                                                    .then(res => res.json())
                                                    .then(teamPlayers => {
                                                        fetch(`/api/redcards/${match.championshipid}/`)
                                                        .then(resp => resp.json())
                                                        .then(reds => {
                                                            const redGetters = reds.filter(x => x.team === winner).map(red => red.playerid);
                                                            console.log(redGetters)
                                                            let tmPlayers = teamPlayers.filter(pl => pl.currentteam === winner)
                                                            const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                            //return filteredPlayers
                                                            fetch(`/api/formations/${parseInt(match.nextmatchid)+1}/${frm.id}/`, {
                                                                method:"put",
                                                                headers: { 
                                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                                }, 
                                                                body: makeCustomFormation(winner, filteredPlayers)
                                                            })
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    })
                                }
            
                            } else if (dataa.team2 === 500 && dataa.team1 !== winner) {
                                nextNextFormData.append('team2', winner)
                                if (dataa.team1 !== 500) {
                                    fetch(`/api/teams/${dataa.team1}/`)
                                    .then(respo => respo.json())
                                    .then(tm1 => {
                                        fetch(`/api/teams/${winner}/`)
                                        .then(respo => respo.json())
                                        .then(tm2 => {
                                            fetch(`/api/refereeing/${dataa.matchdate}/`)
                                            .then(rs => rs.json())
                                            .then(data => {
                                                const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                                if (referees.length > 0) {
                                                const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                                nextNextFormData.append('referee', randomReferee.name)
                                                fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                                    method: 'PUT',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: nextNextFormData
                                                })
                                                fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                                    method: 'POST',
                                                    headers: { 
                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    },
                                                    body: JSON.stringify({"referee":randomReferee.name})
                                                })
                                                }
                                            })
                                            fetch(`/api/formations/${parseInt(match.nextmatchid)+1}/`)
                                            .then(rspp => rspp.json())
                                            .then(formationss => {
                                                let frm = formationss[1]
                                                if (frm) {
                                                    fetch(`/api/players/`)
                                                    .then(res => res.json())
                                                    .then(teamPlayers => {
                                                        fetch(`/api/redcards/${match.championshipid}/`)
                                                        .then(resp => resp.json())
                                                        .then(reds => {
                                                            const redGetters = reds.filter(x => x.team === winner).map(red => red.playerid);
                                                            console.log(redGetters)
                                                            let tmPlayers = teamPlayers.filter(pl => pl.currentteam === winner)
                                                            const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                            //return filteredPlayers
                                                            fetch(`/api/formations/${parseInt(match.nextmatchid)+1}/${frm.id}/`, {
                                                                method:"put",
                                                                headers: { 
                                                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                                                }, 
                                                                body: makeCustomFormation(winner, filteredPlayers)
                                                            })
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    })
                                }
                            }
                        })
            
            
                    }

                    if (!match.nextmatchid) {
                        const finalFD = new FormData()
                        finalFD.append('winner', winner)
                        finalFD.append('secondplace', secondplace)
                        fetch(`/api/tournaments/${tournament.championshipid}/`, {
                            method:"put",
                            headers: { 
                                'Authorization': `JWT ${localStorage.getItem('access')}`
                            }, body: finalFD
                        })
                    } else {
                        const nextMatchFD = new FormData()
                        fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.nextmatchid}/`)
                        .then(nextRes => nextRes.json())
                        .then(nextMtchData => {
                            if (nextMtchData.team1 === 500 && nextMtchData.team2 !== winner) {
                                nextMatchFD.append('team1', winner)
                                } else if (nextMtchData.team2 === 500 && nextMtchData.team1 !== winner) {
                                nextMatchFD.append('team2', winner)
                                }
                                fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.nextmatchid}/`, {
                                method:"put",
                                headers: { 
                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                }, body: nextMatchFD
                            })
                        })
                    }
                    label = "Played " +  formatDateEU(match.matchdate) + " at " + match.starttime + " GMT+0200"
                } else {
                    label = "Played " +  formatDateEU(match.matchdate) + " at " + match.starttime + " GMT+0200";
                }
            } else {
                label = "Played " +  formatDateEU(match.matchdate) + " at " + match.starttime + " GMT+0200"
            }
        }
    }

    return label
}

export function endEarly(tournament, match, reason, winner, secondplace) {
    const fd = new FormData()
    fd.append('endedearlier', 1)
    fd.append('endearlyreason', reason)
    fd.append('status', 'Finished')
    fd.append('winner', winner)
    fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.matchid}/`, {
        method:"put",
        headers: { 
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }, body: fd
    })
    //finalna utakmica
    if (!match.nextmatchid && !match.groupid) {
        const finalFD = new FormData()
            finalFD.append('winner', winner)
            finalFD.append('secondplace', secondplace)
            fetch(`/api/tournaments/${tournament.championshipid}/`, {
                method:"put",
                headers: { 
                    'Authorization': `JWT ${localStorage.getItem('access')}`
            }, body: finalFD
        })
        //detectThirdAndForthPlace(match.championshipid)
    
    // ima sljedecu
    } else if (!match.groupid) {
        // ako je za 3. i 4.mjesto
        if (match.matchid === detectThirdAndForthPlace(match.championshipid)) {
            announceThirdPlace(match.matchid)

        // ako je jedna od dvije utakmice prije one za 3.mjesto
        } else if (detectMatchesBeforeThird(match.championshipid)?.includes(match.matchid)) {
            const nextFormData = new FormData()
            const nextNextFormData = new FormData()
            fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.nextmatchid}/`)
            .then(rsp => rsp.json())
            .then(dataa => {
                if (dataa.team1 === 500 && dataa.team2 !== secondplace) {
                    nextFormData.append('team1', secondplace)
                    if (dataa.team2 !== 500) {
                        fetch(`/api/teams/${dataa.team2}/`)
                        .then(respo => respo.json())
                        .then(tm1 => {
                            fetch(`/api/teams/${secondplace}/`)
                            .then(respo => respo.json())
                            .then(tm2 => {
                                fetch(`/api/refereeing/${dataa.matchdate}/`)
                                .then(rs => rs.json())
                                .then(data => {
                                    const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                    if (referees.length > 0) {
                                    const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                    nextFormData.append('referee', randomReferee.name)
                                    fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                        method: 'PUT',
                                        headers: { 
                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                        },
                                        body: nextFormData
                                    })
                                    fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                        method: 'POST',
                                        headers: { 
                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                        },
                                        body: JSON.stringify({"referee":randomReferee.name})
                                    })
                                    }
                                })
                                fetch(`/api/formations/${match.nextmatchid}/`)
                                .then(rspp => rspp.json())
                                .then(formationss => {
                                    let frm = formationss[0]
                                    if (frm) {
                                        fetch(`/api/players/`)
                                        .then(res => res.json())
                                        .then(teamPlayers => {
                                            fetch(`/api/redcards/${match.championshipid}/`)
                                            .then(resp => resp.json())
                                            .then(reds => {
                                                const redGetters = reds.filter(x => x.team === secondplace).map(red => red.playerid);
                                                console.log(redGetters)
                                                let tmPlayers = teamPlayers.filter(pl => pl.currentteam === secondplace)
                                                const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                //return filteredPlayers
                                                fetch(`/api/formations/${match.nextmatchid}/${frm.id}/`, {
                                                    method:"put",
                                                    headers: { 
                                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    }, 
                                                    body: makeCustomFormation(secondplace, filteredPlayers)
                                                })
                                            })
                                        })
                                    }
                                })
                            })
                        })
                    }

                } else if (dataa.team2 === 500 && dataa.team1 !== winner) {
                    nextFormData.append('team2', winner)
                    if (dataa.team1 !== 500) {
                        fetch(`/api/teams/${dataa.team1}/`)
                        .then(respo => respo.json())
                        .then(tm1 => {
                            fetch(`/api/teams/${winner}/`)
                            .then(respo => respo.json())
                            .then(tm2 => {
                                fetch(`/api/refereeing/${dataa.matchdate}/`)
                                .then(rs => rs.json())
                                .then(data => {
                                    const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                    if (referees.length > 0) {
                                    const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                    nextFormData.append('referee', randomReferee.name)
                                    fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                        method: 'PUT',
                                        headers: { 
                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                        },
                                        body: nextFormData
                                    })
                                    fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                        method: 'POST',
                                        headers: { 
                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                        },
                                        body: JSON.stringify({"referee":randomReferee.name})
                                    })
                                    }
                                })
                                fetch(`/api/formations/${match.nextmatchid}/`)
                                .then(rspp => rspp.json())
                                .then(formationss => {
                                    let frm = formationss[1]
                                    if (frm) {
                                        fetch(`/api/players/`)
                                        .then(res => res.json())
                                        .then(teamPlayers => {
                                            fetch(`/api/redcards/${match.championshipid}/`)
                                            .then(resp => resp.json())
                                            .then(reds => {
                                                const redGetters = reds.filter(x => x.team === winner).map(red => red.playerid);
                                                console.log(redGetters)
                                                let tmPlayers = teamPlayers.filter(pl => pl.currentteam === winner)
                                                const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                //return filteredPlayers
                                                fetch(`/api/formations/${match.nextmatchid}/${frm.id}/`, {
                                                    method:"put",
                                                    headers: { 
                                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    }, 
                                                    body: makeCustomFormation(winner, filteredPlayers)
                                                })
                                            })
                                        })
                                    }
                                })
                            })
                        })
                    }
                }
            })

            fetch(`/api/tournaments/${tournament.championshipid}/matches/${parseInt(match.nextmatchid)+1}/`)
            .then(rsp => rsp.json())
            .then(dataa => {
                if (dataa.team1 === 500 && dataa.team2 !== winner) {
                    nextNextFormData.append('team1', winner)
                    if (dataa.team2 !== 500) {
                        fetch(`/api/teams/${dataa.team2}/`)
                        .then(respo => respo.json())
                        .then(tm1 => {
                            fetch(`/api/teams/${winner}/`)
                            .then(respo => respo.json())
                            .then(tm2 => {
                                fetch(`/api/refereeing/${dataa.matchdate}/`)
                                .then(rs => rs.json())
                                .then(data => {
                                    const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                    if (referees.length > 0) {
                                    const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                    nextNextFormData.append('referee', randomReferee.name)
                                    fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                        method: 'PUT',
                                        headers: { 
                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                        },
                                        body: nextNextFormData
                                    })
                                    fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                        method: 'POST',
                                        headers: { 
                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                        },
                                        body: JSON.stringify({"referee":randomReferee.name})
                                    })
                                    }
                                })
                                fetch(`/api/formations/${parseInt(match.nextmatchid)+1}/`)
                                .then(rspp => rspp.json())
                                .then(formationss => {
                                    let frm = formationss[0]
                                    if (frm) {
                                        fetch(`/api/players/`)
                                        .then(res => res.json())
                                        .then(teamPlayers => {
                                            fetch(`/api/redcards/${match.championshipid}/`)
                                            .then(resp => resp.json())
                                            .then(reds => {
                                                const redGetters = reds.filter(x => x.team === winner).map(red => red.playerid);
                                                console.log(redGetters)
                                                let tmPlayers = teamPlayers.filter(pl => pl.currentteam === winner)
                                                const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                //return filteredPlayers
                                                fetch(`/api/formations/${parseInt(match.nextmatchid)+1}/${frm.id}/`, {
                                                    method:"put",
                                                    headers: { 
                                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    }, 
                                                    body: makeCustomFormation(winner, filteredPlayers)
                                                })
                                            })
                                        })
                                    }
                                })
                            })
                        })
                    }

                } else if (dataa.team2 === 500 && dataa.team1 !== winner) {
                    nextNextFormData.append('team2', winner)
                    if (dataa.team1 !== 500) {
                        fetch(`/api/teams/${dataa.team1}/`)
                        .then(respo => respo.json())
                        .then(tm1 => {
                            fetch(`/api/teams/${winner}/`)
                            .then(respo => respo.json())
                            .then(tm2 => {
                                fetch(`/api/refereeing/${dataa.matchdate}/`)
                                .then(rs => rs.json())
                                .then(data => {
                                    const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                    if (referees.length > 0) {
                                    const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                    nextNextFormData.append('referee', randomReferee.name)
                                    fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                        method: 'PUT',
                                        headers: { 
                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                        },
                                        body: nextNextFormData
                                    })
                                    fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                        method: 'POST',
                                        headers: { 
                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                        },
                                        body: JSON.stringify({"referee":randomReferee.name})
                                    })
                                    }
                                })
                                fetch(`/api/formations/${parseInt(match.nextmatchid)+1}/`)
                                .then(rspp => rspp.json())
                                .then(formationss => {
                                    let frm = formationss[1]
                                    if (frm) {
                                        fetch(`/api/players/`)
                                        .then(res => res.json())
                                        .then(teamPlayers => {
                                            fetch(`/api/redcards/${match.championshipid}/`)
                                            .then(resp => resp.json())
                                            .then(reds => {
                                                const redGetters = reds.filter(x => x.team === winner).map(red => red.playerid);
                                                console.log(redGetters)
                                                let tmPlayers = teamPlayers.filter(pl => pl.currentteam === winner)
                                                const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                //return filteredPlayers
                                                fetch(`/api/formations/${parseInt(match.nextmatchid)+1}/${frm.id}/`, {
                                                    method:"put",
                                                    headers: { 
                                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    }, 
                                                    body: makeCustomFormation(winner, filteredPlayers)
                                                })
                                            })
                                        })
                                    }
                                })
                            })
                        })
                    }
                }
            })


        }
        // ako je obicna eliminacijska utakmica prije finala i za 3.mjesto
        else {
            const nextFormData = new FormData()
            fetch(`/api/tournaments/${tournament.championshipid}/matches/${match.nextmatchid}/`)
            .then(rsp => rsp.json())
            .then(dataa => {
                if (dataa.team1 === 500 && dataa.team2 !== winner) {
                    nextFormData.append('team1', winner)
                    if (dataa.team2 !== 500) {
                        fetch(`/api/teams/${dataa.team2}/`)
                        .then(respo => respo.json())
                        .then(tm1 => {
                            fetch(`/api/teams/${winner}/`)
                            .then(respo => respo.json())
                            .then(tm2 => {
                                fetch(`/api/refereeing/${dataa.matchdate}/`)
                                .then(rs => rs.json())
                                .then(data => {
                                    const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                    if (referees.length > 0) {
                                    const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                    nextFormData.append('referee', randomReferee.name)
                                    fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                        method: 'PUT',
                                        headers: { 
                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                        },
                                        body: nextFormData
                                    })
                                    fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                        method: 'POST',
                                        headers: { 
                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                        },
                                        body: JSON.stringify({"referee":randomReferee.name})
                                    })
                                    }
                                })
                                fetch(`/api/formations/${match.nextmatchid}/`)
                                .then(rspp => rspp.json())
                                .then(formationss => {
                                    let frm = formationss[0]
                                    if (frm) {
                                        fetch(`/api/players/`)
                                        .then(res => res.json())
                                        .then(teamPlayers => {
                                            fetch(`/api/redcards/${match.championshipid}/`)
                                            .then(resp => resp.json())
                                            .then(reds => {
                                                const redGetters = reds.filter(x => x.team === winner).map(red => red.playerid);
                                                console.log(redGetters)
                                                let tmPlayers = teamPlayers.filter(pl => pl.currentteam === winner)
                                                const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                //return filteredPlayers
                                                fetch(`/api/formations/${match.nextmatchid}/${frm.id}/`, {
                                                    method:"put",
                                                    headers: { 
                                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    }, 
                                                    body: makeCustomFormation(winner, filteredPlayers)
                                                })
                                            })
                                        })
                                    }
                                })
                            })
                        })
                    }
                } else if (dataa.team2 === 500 && dataa.team1 !== winner) {
                    nextFormData.append('team2', winner)
                    if (dataa.team1 !== 500) {
                        fetch(`/api/teams/${dataa.team1}/`)
                        .then(respo => respo.json())
                        .then(tm1 => {
                            fetch(`/api/teams/${winner}/`)
                            .then(respo => respo.json())
                            .then(tm2 => {
                                fetch(`/api/refereeing/${dataa.matchdate}/`)
                                .then(rs => rs.json())
                                .then(data => {
                                    const referees = data.filter(ref => ref.country !== tm1.country && ref.country !== tm2.country);
                                    if (referees.length > 0) {
                                    const randomReferee = referees[Math.floor(Math.random() * referees.length)];
                                    nextFormData.append('referee', randomReferee.name)
                                    fetch(`/api/tournaments/${dataa.championshipid}/matches/${dataa.matchid}/`,{
                                        method: 'PUT',
                                        headers: { 
                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                        },
                                        body: nextFormData
                                    })
                                    fetch(`/api/refereeing/${dataa.matchdate}/`, {
                                        method: 'POST',
                                        headers: { 
                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                        },
                                        body: JSON.stringify({"referee":randomReferee.name})
                                    })
                                    }
                                })
                                fetch(`/api/formations/${match.nextmatchid}/`)
                                .then(rspp => rspp.json())
                                .then(formationss => {
                                    let frm = formationss[1]
                                    if (frm) {
                                        fetch(`/api/players/`)
                                        .then(res => res.json())
                                        .then(teamPlayers => {
                                            fetch(`/api/redcards/${match.championshipid}/`)
                                            .then(resp => resp.json())
                                            .then(reds => {
                                                const redGetters = reds.filter(x => x.team === winner).map(red => red.playerid);
                                                console.log(redGetters)
                                                let tmPlayers = teamPlayers.filter(pl => pl.currentteam === winner)
                                                const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
                                                //return filteredPlayers
                                                fetch(`/api/formations/${match.nextmatchid}/${frm.id}/`, {
                                                    method:"put",
                                                    headers: { 
                                                        'Authorization': `JWT ${localStorage.getItem('access')}`
                                                    }, 
                                                    body: makeCustomFormation(winner, filteredPlayers)
                                                })
                                            })
                                        })
                                    }
                                })
                            })
                        })
                    }
                }
                
            })
        }
    }

}

export function detectThirdAndForthPlace(tournamentID) {
    fetch(`/api/tournaments/${tournamentID}/matches/`)
    .then(resp => resp.json())
    .then(matchez => {
        let finalMatchID = null
        let thirdPlaceMatchID = null
        const allMatches = matchez.filter(m => m.groupid < 1).reduce((dict, match) => {
            dict[match.matchid] = match.nextmatchid;
            return dict;
        }, {});
        for (const [matchId, nextMatchId] of Object.entries(allMatches)) {
            if (nextMatchId < 1) {
                finalMatchID = parseInt(matchId);
                break
            }
        }
        if (finalMatchID) {
            for (const [matchId, nextMatchId] of Object.entries(allMatches)) {
                if (nextMatchId === finalMatchID) {
                    thirdPlaceMatchID = parseInt(matchId);
                    break;
                }
            }
        }
        return thirdPlaceMatchID
    })
}

export async function detectMatchesBeforeThird(tournamentID) {
    const resp = await fetch(`/api/tournaments/${tournamentID}/matches/`);
    const matchez = await resp.json();
  
    let finalMatchID = null;
    let thirdPlaceMatchID = null;
    let matchesBeforeThird = [];
    const allMatches = matchez
      .filter(m => m.groupid < 1)
      .reduce((dict, match) => {
        dict[match.matchid] = match.nextmatchid;
        return dict;
      }, {});
  
    for (const [matchId, nextMatchId] of Object.entries(allMatches)) {
      if (nextMatchId < 1) {
        finalMatchID = parseInt(matchId);
        break;
      }
    }
  
    if (finalMatchID) {
      for (const [matchId, nextMatchId] of Object.entries(allMatches)) {
        if (nextMatchId === finalMatchID) {
          thirdPlaceMatchID = parseInt(matchId);
          break;
        }
      }
      if (thirdPlaceMatchID) {
        for (const [matchId, nextMatchId] of Object.entries(allMatches)) {
          if (nextMatchId === thirdPlaceMatchID) {
            let beforeThirdPlace = parseInt(matchId);
            matchesBeforeThird.push(beforeThirdPlace);
          }
        }
      }
    }
  
    return matchesBeforeThird;
  }

export function announceThirdPlace(tournamentID, thirdPlaceMatchID) {
    const thirdPlaceFD = new FormData()
    fetch(`/api/tournaments/${tournamentID}/matches/${thirdPlaceMatchID}/`)
    .then(rs => rs.json())
    .then(matchData => {
        let third = 0
        let fourth = 0
        if (matchData.winner === matchData.team1) {
            third = matchData.team1
            fourth = matchData.team2
        } else {
            third = matchData.team2
            fourth = matchData.team1
        }
        thirdPlaceFD.append("thirdplace", third)
        thirdPlaceFD.append("fourthplace", fourth)
        fetch(`/api/tournaments/${tournamentID}/`, {
            method:"put",
            headers: { 
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }, 
            body: thirdPlaceFD
        })
    }) 
}


/*function endEarly() {
    const fd = new FormData()
    fd.append('endedearlier', 1)
    fd.append('endearlyreason', reason)
    fd.append('status', 'Finished')
    const winner = null
    if (matchInfo.score1 > matchInfo.score2) {
      fd.append('winner', team1)
      winner = team1
    } else if (matchInfo.score1 < matchInfo.score2) {
      fd.append('winner', team2)
      winner = team2
    }
    
    if (matchInfo.drawpossible) {
      singleMatchDecider(props.id, props.mid, matchInfo.winner, 1, !friendly, team1, team2)
    } else {
      singleMatchDecider(props.id, props.mid, matchInfo.winner, 0, !friendly, team1, team2)
    }
    fetch(`/api/tournaments/${props.id}/matches/${props.mid}/`, {
      method: 'PUT',
      headers: { 
          'Authorization': `JWT ${localStorage.getItem('access')}`
      },
      body: fd
    }).then(_ => {
      singleMatchDecider(props.id, props.mid, winner, 0, !friendly, team1, team2)
      setShowEndModal(false)
      getCurrentSituation()
    })
    fetch(`/api/tournaments/${props.id}/matches/${matchInfo.nextmatchid}/`)
    .then(rsp => rsp.json())
    .then(dataa => {
      if (dataa.team1 === 500 && dataa.team2 !== winner.id) {
        fd3.append('team1', winner.id)
      } else if (dataa.team2 === 500 && dataa.team1 !== winner.id) {
        fd3.append('team2', winner.id)
      }
    })
  }*/


export function singleMatchDecider (tournamentID, matchID, winner, signal, applyRating, team1, team2) {
    const fd = new FormData()
    switch (signal) {
        // when elimination match ends earlier, status and rating changes, and next match participant is set
        case 0:
            fd.append('status', 'Finished')
            fd.append('winner', winner)
            if (applyRating) {
                calculateEloRating(team1, team2, winner)
                calculateEloRating(team2, team1, winner)
            }
            fetch(`/api/tournaments/${tournamentID}/matches/${matchID}/`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: fd
            })

            // set next match participant
            fetch(`/api/tournaments/${tournamentID}/matches/${matchID}/`)
            .then(mtchRes => mtchRes.json())
            .then(mtchData => {
                const nextMatchFD = new FormData()
                fetch(`/api/tournaments/${tournamentID}/matches/${mtchData.nextmatchid}/`)
                .then(newResponse => newResponse.json())
                .then(newData => {
                    if (newData.team1.id === 500 && newData.team2.id !== winner.id) {
                        nextMatchFD.append('team1', winner.id)
                        fetch(`/api/tournaments/${tournamentID}/matches/${mtchData.nextmatchid}/`, {
                            method: 'PUT',
                            headers: { 
                                'Authorization': `JWT ${localStorage.getItem('access')}`
                            },
                            body: nextMatchFD 
                        })
                    } else if (newData.team2.id === 500 && newData.team1.id !== winner.id) {
                        nextMatchFD.append('team2', winner.id)
                        fetch(`/api/tournaments/${tournamentID}/matches/${mtchData.nextmatchid}/`, {
                            method: 'PUT',
                            headers: { 
                                'Authorization': `JWT ${localStorage.getItem('access')}`
                            },
                            body: nextMatchFD 
                        })
                    }
                    // update formation players too
                    fetch(`/api/formations/${newData.matchid}/`)
                    .then(formRes => formRes.json())
                    .then(formationDt => {
                        fetch('/api/players/')
                        .then(response => response.json())
                        .then(allplayers => {
                            const teamPlayers = allplayers.filter(p => p.currentteam === winner.id)
                            fetch(`/api/formations/${mtchData.matchid}/`), {
                                method: 'PUT',
                                headers: { 
                                    'Authorization': `JWT ${localStorage.getItem('access')}`
                                },
                                body: updateCustomFormation(winner.id, formationDt, teamPlayers, formationDt.formationtype) 
                            }
                        })
                    })
                })
            })
            break;
        // group finished (early or on time), no effect on other matches, only rating
        case 1:
            fd.append('status', 'Finished')
            fd.append('winner', winner)
            if (applyRating) {
                calculateEloRating(team1, team2, winner)
                calculateEloRating(team2, team1, winner)
            }
            fetch(`/api/tournaments/${tournamentID}/matches/${matchID}/`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                body: fd
            })
            break;

        case 2:

        default:
                break;
    }
   
    //fetch(`/api/tournaments/${tournamentID}/matches/${matchID}/`)
    //.then()
}

export function transformFormation(tournamentID, team) {
    console.log(team)
    fetch(`/api/redcards/${tournamentID}/`)
    .then(resp => resp.json())
    .then(reds => {
        fetch(`/api/players/`)
        .then(res => res.json())
        .then(teamPlayers => {
            const redGetters = reds.filter(x => x.team === team).map(red => red.playerid);
            console.log(redGetters)
            let tmPlayers = teamPlayers.filter(pl => pl.currentteam === team)
            const filteredPlayers = tmPlayers.filter(pl => !redGetters.includes(pl.id))
            console.log(filteredPlayers)
            return filteredPlayers
        })
    })
}

export function groupDecider (tournamentID, groupID) {

}

export function getMatchesInProgress () {
    fetch(`/api/tournaments/`)
    .then(rsp => rsp.json())
    .then(dt => {
        dt.map(tourn => {
            fetch(`/api/tournaments/${tourn.championshipid}/matches/`)
            .then(rsp2 => rsp2.json())
            .then(data => console.log(data.sort((a,b) => a.matchid - b.matchid)))
        })
    })
}

export function calculateEloRating(player, opponent, winner) {
    const playerRating = player.rating
    const opponentRating = opponent.rating
    const actualScore = winner === player ? 1 : winner === opponent ? 0 : 0.5
    const kFactor = 60
    const expectedScore = 1/(1 + (10**((opponentRating - playerRating)/400)))
    const rateChange = kFactor * (actualScore - expectedScore)
    const newRating = playerRating + rateChange
    const fd = new FormData()
    fd.append('rating', parseInt(newRating))
    fetch(`/api/teams/${player.id}/`, {
        method: 'PUT',
        headers: { 
            'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: fd
    })
    fetch(`/api/players/`).then(resp => resp.json())
    .then(plyrs => {
        const filteredPlayers = plyrs.filter(x => x.currentteam === player)
        filteredPlayers.map(play => {
            fetch(`/api/players/${play.id}/`)
            .then(playerResp => playerResp.json())
            .then(playerData => {
                const fdPlayer = new FormData()
                fdPlayer.append('rating', parseInt(playerData.rating) + parseInt(rateChange))
                fetch(`/api/players/${playerData.id}/`, {
                    method: 'PUT',
                    headers: { 
                        'Authorization': `JWT ${localStorage.getItem('access')}`
                    },
                    body: fdPlayer
                })
            })
        })
    })
}

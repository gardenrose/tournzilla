import './css/Table.css';
import './css/Homepage.css'
import logo from './images/logo.png';

document.body.style.backgroundColor = "#0c1246";
document.title = "Tournzilla";
const favicon = document.querySelector('[rel=icon]');
favicon.href = logo;

function Table(props) {
  return (
    <div className={props.wide ? 'wide-table' : undefined}>
        {!props.multipleRows ? <div className="table-wrapper">
            <table className="fl-table">
                <thead>
                <tr>
                    <th>{props.title1}</th>
                    <th>{props.title2}</th>
                    <th>{props.title3}</th>
                    <th>{props.title4}</th>
                    <th>{props.title5}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{props.value1}</td>
                    <td>{props.value2}</td>
                    <td>{props.value3}</td>
                    <td>{props.value4}</td>
                    <td>{props.value5}</td>
                </tr>
                </tbody>
            </table>
        </div> : <div className= {props.wide ? undefined : 'multiline-table'}>
            <table className="fl-table">
                <thead>
                <tr>
                    <th>Pos</th>
                    <th>Team</th>
                    <th>Pld</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Pts</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{props.pos1}</td>
                    <td className='left-align-text'>{props.team1}</td>
                    <td>{props.pld1}</td>
                    <td>{props.w1}</td>
                    <td>{props.d1}</td>
                    <td>{props.l1}</td>
                    <td>{props.gf1}</td>
                    <td>{props.ga1}</td>
                    <td>{props.gd1}</td>
                    <th>{props.pts1}</th>
                </tr>
                <tr>
                    <td>{props.pos2}</td>
                    <td className='left-align-text'>{props.team2}</td>
                    <td>{props.pld2}</td>
                    <td>{props.w2}</td>
                    <td>{props.d2}</td>
                    <td>{props.l2}</td>
                    <td>{props.gf2}</td>
                    <td>{props.ga2}</td>
                    <td>{props.gd2}</td>
                    <th>{props.pts2}</th>
                </tr>
                <tr>
                    <td>{props.pos3}</td>
                    <td className='left-align-text'>{props.team3}</td>
                    <td>{props.pld3}</td>
                    <td>{props.w3}</td>
                    <td>{props.d3}</td>
                    <td>{props.l3}</td>
                    <td>{props.gf3}</td>
                    <td>{props.ga3}</td>
                    <td>{props.gd3}</td>
                    <th>{props.pts3}</th>
                </tr>
                <tr>
                    <td>{props.pos4}</td>
                    <td className='left-align-text'>{props.team4}</td>
                    <td>{props.pld4}</td>
                    <td>{props.w4}</td>
                    <td>{props.d4}</td>
                    <td>{props.l4}</td>
                    <td>{props.gf4}</td>
                    <td>{props.ga4}</td>
                    <td>{props.gd4}</td>
                    <th>{props.pts4}</th>
                </tr>
                </tbody>
            </table>
        </div>}
       
    </div>
  );
}

export default Table;

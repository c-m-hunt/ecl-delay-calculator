import * as React from 'react'
import { Response as RecalcResponse, BreakType } from '../lib/calc'

interface Props {
  recalcResponse: RecalcResponse
}

const Response: React.FunctionComponent<Props> = (props: Props) => {
  const {
    recalcResponse,
    recalcResponse: { target },
  } = props
  const maxPlusOneBowlers: number =
    recalcResponse.overs % recalcResponse.maxPerBowler
  return (
    <div className="card bg-dark text-white response">
      <div className="card-header">
        <h3>Recalculated playing conditions</h3>
      </div>
      <div className="card-body">
        {!target && (
          <p>
            As the delay occurred before the start of play, the following
            conditions apply to both innings
          </p>
        )}
        <dl>
          {recalcResponse.target && (
            <React.Fragment>
              <dt>2nd innings target:</dt>
              <dd>{recalcResponse.target}</dd>
            </React.Fragment>
          )}
          {recalcResponse.targetExact !== undefined && recalcResponse.target &&
            <div className="card text-white bg-info">
              <div className="card-body">
                <p className="card-text">
                  Rule 9 iii. h.<br />
                  {recalcResponse.targetExact ?
                    `This is an EXACT target and the game is tied at ${recalcResponse.target - 1}` :
                    `The target is a fraction and therefore there CANNOT be a TIE. The team batting second loses if they only score ${recalcResponse.target - 1}`
                  }
                </p>
              </div>
            </div>
          }

          {recalcResponse.targetRunRate &&
            <React.Fragment>
              <dt>2nd innings run rate:</dt>
              <dd>{recalcResponse.targetRunRate}</dd>
            </React.Fragment>
          }

          <dt>Overs:</dt>
          <dd>{recalcResponse.overs}</dd>

          <dt>Max per bowler:</dt>
          <dd>
            {`${recalcResponse.maxPerBowler} overs`}
            {maxPlusOneBowlers ?
              ` with up to ${maxPlusOneBowlers} able to bowl ${recalcResponse.maxPerBowler +
              1} overs` : ''}
          </dd>

          <dt>Fielding restrictions:</dt>
          <dd>{recalcResponse.powerPlay} overs</dd>

          {recalcResponse.targetRunRate && recalcResponse.breakType === BreakType.FIRST &&
            <div className="card text-white bg-info">
              <div className="card-body">
                <p className="card-text">
                  Ensure you have noted down the 2nd innings run rate. This will be required if there are reductions of overs in the 2nd innings.
                </p>
              </div>
            </div>
          }

          {recalcResponse.targetRunRate && recalcResponse.breakType === BreakType.SECOND &&
            <div className="card text-white bg-info">
              <div className="card-body">
                <p className="card-text">
                  It's possible that some bowlers may have already exceeded the bowling quota. No further bowlers are allowed to exceed that quota.
                </p>
              </div>
            </div>
          }
        </dl>
      </div>
    </div>
  )
}

export default Response

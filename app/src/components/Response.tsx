import * as React from 'react'
import { Response as RecalcResponse } from '../lib/calc'

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

          <dt>Overs:</dt>
          <dd>{recalcResponse.overs}</dd>

          <dt>Max per bowler:</dt>
          <dd>
            {`${recalcResponse.maxPerBowler} overs`}
            {maxPlusOneBowlers &&
              ` with up to ${maxPlusOneBowlers} able to bowl ${recalcResponse.maxPerBowler +
              1} overs`}
          </dd>

          <dt>Fielding restrictions:</dt>
          <dd>{recalcResponse.powerPlay}</dd>
        </dl>
      </div>
    </div>
  )
}

export default Response

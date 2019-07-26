import * as React from 'react'
import {
  firstInningsTimeLost,
  matchStartLate,
  Response as RecalcResponse,
  config,
  secondInningsTimeLost,
} from '../lib/calc'
import Response from './Response'

interface Props { }

type DelayWhen = 'before' | 'first' | 'second'

interface State {
  delayWhen: DelayWhen | null
  timeLost: number | null
  recalcResponse: RecalcResponse | null
  teaTaken: boolean
  firstInningsRuns: number | null
  oversCompleted: number | null
  oversTarget: number | null
  abandonMessage: string | null
  errorMessage: string | null
  targetRunRate: string | null
}

class App extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      delayWhen: null,
      timeLost: 0,
      recalcResponse: null,
      teaTaken: false,
      firstInningsRuns: 0,
      oversCompleted: config.startingOvers,
      oversTarget: config.startingOvers,
      abandonMessage: null,
      errorMessage: null,
      targetRunRate: null,
    }
  }

  setWhen = (when: DelayWhen) => {
    this.setState({
      delayWhen: when,
      recalcResponse: null,
      teaTaken: false,
      firstInningsRuns: 0,
      oversCompleted: config.startingOvers,
      oversTarget: config.startingOvers,
      abandonMessage: null,
      errorMessage: null
    })
  }

  calculateDelayBeforeMatchStart = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const { timeLost, teaTaken } = this.state
    try {
      if (timeLost) {
        const recalcResult = matchStartLate(
          timeLost,
          teaTaken
        )
        this.setState({
          recalcResponse: recalcResult,
          abandonMessage: null,
          errorMessage: null
        })
      } else {
        this.setState({
          errorMessage: 'Ensure that you have entered a value for time lost',
          recalcResponse: null
        })
      }
    } catch (err) {
      this.setState({
        abandonMessage: err.message,
        errorMessage: null,
        recalcResponse: null,
      })
    }
  }

  calculateDelaySecondInnings = (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()
    const {
      timeLost,
      targetRunRate,
      oversTarget
    } = this.state
    try {
      if (targetRunRate && oversTarget && timeLost) {
        const recalcResult = secondInningsTimeLost(
          timeLost,
          oversTarget,
          parseFloat(targetRunRate)
        )
        console.log(recalcResult)
        this.setState({
          recalcResponse: recalcResult,
          abandonMessage: null,
          errorMessage: null
        })
      } else {
        this.setState({
          errorMessage: `Ensure you've entered a first innings total, overs completed, overs target and time lost`,
          recalcResponse: null,
        })
      }
    } catch (err) {
      this.setState({
        abandonMessage: err.message,
        errorMessage: null,
        recalcResponse: null,
      })
    }
  }

  calculateDelayDuringFirstInnings = (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()
    const {
      timeLost,
      firstInningsRuns,
      oversCompleted,
      teaTaken,
      oversTarget,
    } = this.state
    try {
      if (firstInningsRuns && oversCompleted && timeLost && oversTarget) {
        const recalcResult = firstInningsTimeLost(
          firstInningsRuns,
          oversCompleted,
          timeLost,
          teaTaken,
          oversTarget
        )
        console.log(recalcResult)
        this.setState({
          recalcResponse: recalcResult,
          abandonMessage: null,
          errorMessage: null
        })
      } else {
        this.setState({
          errorMessage: `Ensure you've entered a first innings total, overs completed, overs target and time lost`,
          recalcResponse: null,
        })
      }
    } catch (err) {
      this.setState({
        abandonMessage: err.message,
        errorMessage: null,
        recalcResponse: null,
      })
    }
  }

  tidyNumber = (value: string) => {
    let retVal: number | null = null;
    if (Number(value) !== NaN) {
      retVal = parseInt(value, 10)
    }
    return retVal;
  }

  renderTimeLost = (timeLostMessage: string = '') => {
    const { timeLost } = this.state
    return <div className="form-group">
      <label htmlFor="timeLost">Time lost (minutes):</label>
      <input
        type="number"
        value={timeLost || ""}
        onChange={e => {
          this.setState({ timeLost: this.tidyNumber(e.currentTarget.value) })
        }}
        className="form-control"
        id="timeLost"
        aria-describedby="timeLostHelp"
        placeholder="Time lost in minutes"
      />
      <small id="timeLostHelp" className="form-text text-muted">
        {`Enter the amount of time in minutes lost. ${timeLostMessage} `}
      </small>
    </div>
  }

  renderTeaTaken = () => {
    const { teaTaken } = this.state
    return (
      <React.Fragment>
        {this.renderTimeLost()}
        <div className="form-check">
          <input
            type="checkbox"
            checked={teaTaken}
            onChange={() => this.setState({ teaTaken: !teaTaken })}
            className="form-check-input"
            id="teaTaken"
          />
          <label className="form-check-label" htmlFor="teaTaken">
            Tea taken?
          </label>
        </div>
      </React.Fragment>
    )
  }

  renderBefore = () => {
    const { timeLost } = this.state
    return (
      <div className="card">
        <div className="card-header">
          <h3>Delay before start</h3>
        </div>
        <div className="card-body">
          <form>
            {this.renderTimeLost()}
            {this.renderTeaTaken()}
            <button
              type="submit"
              onClick={this.calculateDelayBeforeMatchStart}
              className="btn btn-primary"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    )
  }

  renderFirst = () => {
    const { firstInningsRuns, oversCompleted, oversTarget } = this.state
    const targetOversHelpMsg = `Enter the number of overs scheduled for first innings at the
    start of the game. If there was no delay before the start of the
      game, this should be {config.startingOvers} overs`
    return (
      <div className="card">
        <div className="card-header">
          <h3>Delay during first innings</h3>
        </div>
        <div className="card-body">
          <form>
            <div className="form-group">
              <label htmlFor="firstInningsRuns">1st innings runs scored:</label>
              <input
                type="number"
                value={firstInningsRuns || ""}
                onChange={e => {
                  this.setState({
                    firstInningsRuns: this.tidyNumber(e.currentTarget.value),
                  })
                }}
                className="form-control"
                id="firstInningsRuns"
                aria-describedby="firstInningsRunsHelp"
                placeholder="1st innings runs scored"
              />
              <small id="firstInningsRunsHelp" className="form-text text-muted">
                Enter the runs scored at the end of first innings
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="oversCompleted">
                Overs completed (full or part):
              </label>
              <input
                type="number"
                value={oversCompleted || ""}
                onChange={e => {
                  this.setState({
                    oversCompleted: this.tidyNumber(e.currentTarget.value),
                  })
                }}
                className="form-control"
                id="oversCompleted"
                aria-describedby="oversCompletedHelp"
              />
              <small id="oversCompletedHelp" className="form-text text-muted">
                Enter the number of full or part overs in the first innings.
                Unless the team batting first was bowled out, this should be the
                same as the target overs. Example: if team all out in 41.1
                overs, enter 42
              </small>
            </div>

            {this.renderTargetOvers(targetOversHelpMsg)}
            {this.renderTimeLost('If time was lost before the start of the match, add up to 30 minutes to account for the free time (rule 4 ii.).')}
            {this.renderTeaTaken()}
            <button
              type="submit"
              onClick={this.calculateDelayDuringFirstInnings}
              className="btn btn-primary"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    )
  }

  renderTargetOvers = (msg: string = '') => {
    const { oversTarget } = this.state
    return <div className="form-group">
      <label htmlFor="oversTarget">Overs target:</label>
      <input
        type="number"
        value={oversTarget || ""}
        onChange={e => {
          this.setState({
            oversTarget: this.tidyNumber(e.currentTarget.value),
          })
        }}
        className="form-control"
        id="oversTarget"
        aria-describedby="oversTargetHelp"
      />
      <small id="oversTargetHelp" className="form-text text-muted">
        {msg}
      </small>
    </div>
  }

  renderTargetRunRate = () => {
    const { targetRunRate } = this.state
    return <div className="form-group">
      <label htmlFor="oversTarget">Target run rate:</label>
      <input
        type="number"
        value={targetRunRate || ""}
        onChange={e => {
          this.setState({
            targetRunRate: (e.currentTarget.value || '').toString(),
          })
        }}
        className="form-control"
        id="oversTarget"
        aria-describedby="oversTargetHelp"
      />
      <small id="oversTargetHelp" className="form-text text-muted">
        If there has not been any previous delay, the target run rate is the first innings runs divided by the first innings target overs.
        If there was a rain delay in the first innings, this will be the run rate provided by this application.
      </small>
    </div>
  }

  renderAbandon = () => {
    const { abandonMessage } = this.state
    return (
      <div className="card bg-danger text-white">
        <div className="card-header">
          <h3>Abandon Match</h3>
        </div>
        <div className="card-body">
          <p>{abandonMessage}</p>
        </div>
      </div>
    )
  }

  renderSecond = () => {
    const targetOversHelpMsg = `Enter the number of overs scheduled for second innings at the
    start of the innings. If there was no delay before the start of the
      innings, this should be {config.startingOvers} overs`
    return (
      <div className="card">
        <div className="card-header">
          <h3>Delay during second innings</h3>
        </div>
        <div className="card-body">
          <form>
            {this.renderTimeLost('If time was lost before the start of the match, add up to 30 minutes to account for the free time (rule 4 ii.).')}
            {this.renderTargetOvers(targetOversHelpMsg)}
            {this.renderTargetRunRate()}
            <button
              type="submit"
              onClick={this.calculateDelaySecondInnings}
              className="btn btn-primary"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    )
  }

  render() {
    const { delayWhen, recalcResponse, abandonMessage, errorMessage } = this.state
    return (
      <div className="container" data-testid="toggle-container">
        <h1>Essex Cricket League Delay Calculator</h1>
        <p>To be used for 2nd XI matches for 2019 season where there is a delay in play.</p>
        <div className="card">
          <div className="card-body">
            <p>When was the delay?</p>
            <div className="btn-group" role="group" aria-label="Basic example">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  this.setWhen('before')
                }}
              >
                Before any play
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  this.setWhen('first')
                }}
              >
                During first innings
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  this.setWhen('second')
                }}
              >
                During second innings
              </button>
            </div>
          </div>
        </div>
        <div>
          {delayWhen === 'before' && this.renderBefore()}
          {delayWhen === 'first' && this.renderFirst()}
          {delayWhen === 'second' && this.renderSecond()}
          {abandonMessage !== null && this.renderAbandon()}
        </div>

        {errorMessage && <div className='card bg-danger text-white'>
          <div className='card-body'>
            {errorMessage}
          </div>
        </div>}

        {recalcResponse && <Response recalcResponse={recalcResponse} />}
      </div>
    )
  }
}

export default App

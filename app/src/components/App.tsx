import * as React from 'react'
import {
  firstInningsTimeLost,
  matchStartLate,
  Response as RecalcResponse,
  config,
} from '../lib/calc'
import Response from './Response'

interface Props { }

type DelayWhen = 'before' | 'first' | 'second'

interface State {
  delayWhen: DelayWhen | null
  timeLost: number
  recalcResponse: RecalcResponse | null
  teaTaken: boolean
  firstInningsRuns: number
  oversCompleted: number
  oversTarget: number
  abandonMessage: string | null
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
    })
  }

  calculateDelayBeforeMatchStart = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const recalcResult = matchStartLate(
      this.state.timeLost,
      this.state.teaTaken
    )
    this.setState({
      recalcResponse: recalcResult,
      abandonMessage: null,
    })
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
      })
    } catch (err) {
      this.setState({
        abandonMessage: err.message,
      })
    }
  }

  renderStandardFormElements = () => {
    const { timeLost, teaTaken } = this.state
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor="timeLost">Time lost (minutes):</label>
          <input
            type="number"
            value={timeLost}
            onChange={e => {
              this.setState({ timeLost: parseInt(e.currentTarget.value, 10) })
            }}
            className="form-control"
            id="timeLost"
            aria-describedby="timeLostHelp"
            placeholder="Time lost in minutes"
          />
          <small id="timeLostHelp" className="form-text text-muted">
            Enter the amount of time in minutes lost
          </small>
        </div>
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
            {this.renderStandardFormElements()}
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
                value={firstInningsRuns || 0}
                onChange={e => {
                  this.setState({
                    firstInningsRuns: parseInt(e.currentTarget.value, 10),
                  })
                }}
                className="form-control"
                id="firstInningsRuns"
                aria-describedby="firstInningsRunsHelp"
                placeholder="Time lost in minutes"
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
                value={oversCompleted || 0}
                onChange={e => {
                  this.setState({
                    oversCompleted: parseInt(e.currentTarget.value, 10),
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

            <div className="form-group">
              <label htmlFor="oversTarget">Overs target:</label>
              <input
                type="number"
                value={oversTarget || 0}
                onChange={e => {
                  this.setState({
                    oversTarget: parseInt(e.currentTarget.value, 10),
                  })
                }}
                className="form-control"
                id="oversTarget"
                aria-describedby="oversTargetHelp"
              />
              <small id="oversTargetHelp" className="form-text text-muted">
                Enter the number of overs scheduled for first innings at the
                start of the game. If there was no delay before the start of the
                game, this should be {config.startingOvers} overs
              </small>
            </div>

            {this.renderStandardFormElements()}
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

  renderAbandon = () => {
    const { abandonMessage } = this.state
    return (
      <div className="card">
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
    return (
      <div className="card">
        <div className="card-header">
          <h3>Delay during second innings</h3>
        </div>
        <div className="card-body">
          <p>
            There is a {config.freeTime} minutes buffer available before any
            change in playing conditions in the match.
          </p>
          <p>
            Once that time has been lost, any further delays in the second
            innings must result in the match being ABANDONED
          </p>
        </div>
      </div>
    )
  }

  render() {
    const { delayWhen, recalcResponse, abandonMessage } = this.state
    return (
      <div className="container" data-testid="toggle-container">
        <h1>Essex Cricket League Delay Calculator</h1>
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

        {recalcResponse && <Response recalcResponse={recalcResponse} />}
      </div>
    )
  }
}

export default App
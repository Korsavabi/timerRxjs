import React from 'react';
import { useEffect, useState } from "react";
import { fromEvent, interval, Subject } from "rxjs";
import { takeUntil, debounceTime, buffer, filter, map } from "rxjs/operators";
 
const Status = "run" | "stop" | "wait";

const Timer = () => {
    const [sec, setSec] = useState(0);
    const [status, setStatus] = useState(Status);
    const unsubscribe$ = new Subject();
   
    useEffect(() => {
      interval(1000)
        .pipe(takeUntil(unsubscribe$))
        .subscribe(() => {
          if (status === "run") {
            setSec(val => val + 1000);
          }
        });
      return () => {
        unsubscribe$.next();
        unsubscribe$.complete();
      };
    }, [status]);
   
    const start = React.useCallback(() => {
      setStatus("run");
    }, []);
   
    const reset = React.useCallback(() => {
      setStatus("run");
      setSec(0);
    }, []);
   
    const wait = React.useCallback(() => {
        const click = fromEvent(document, 'click')
        click.pipe(
            buffer(click.pipe(debounceTime(300))),
            map(list => list.length),
            filter(x => x === 2 )
            ).subscribe(x => setStatus(x))
        }, []);

    return (
      <div>
        <h1>Timer {new Date(sec).toISOString().slice(11, 19)}</h1>
        <button onClick={start}>Start</button>
        <button onClick={wait}>Wait</button>
        <button onClick={reset}>Reset</button>
      </div>
    );
};

export default Timer;
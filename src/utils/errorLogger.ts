export default function errorLogger(err: Error): void;
export default function errorLogger(err: Error, message: string): void;
export default function errorLogger(err: Error, isPriority: boolean): void;
export default function errorLogger(err: Error, message: string, isPriority: boolean): void;

export default function errorLogger(err: Error, arg1?: string | boolean, arg2?: boolean): void {
  const message: string = typeof arg1 === "string" ? arg1 : err.message;
  const isPriority: boolean = typeof arg1 === "boolean" ? arg1 : !!arg2;

  if (process.env.NODE_ENV === "dev") {
    console.log(`\x1b[3${isPriority ? "1" : "4"}m%s\x1b[0m`, message);
    console.log(err);
  } else {
    // TODO add the fetch request to error service
  }
}

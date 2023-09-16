import 'dart:math';

class Math {
  static double logBase(
    num x,
    num base,
  ) =>
      (log(
            x,
          ) /
          log(
            base,
          ));

  static double log2(
    num x,
  ) =>
      (logBase(
        x,
        2,
      ));

  static num create2nSquareRoot(
    num number,
  ) {
    var power = (Math.log2(
      number,
    )).ceil();
    return pow(
      2,
      power,
    );
  }
}

using System.Collections.Generic;

namespace Sen.Shell
{

    public unsafe static class Global
    {
        public static IEnumerable<(T item, U index)> Enumerate<T, U>(IEnumerable<T> collection) where U : struct, IComparable, IConvertible, IComparable<U>, IEquatable<U>
        {
            U index = default;
            foreach (var item in collection)
            {
                yield return (item, index);
                index = Increment(ref index);
            }
        }


        private static U Increment<U>(ref U value)
        {
            if(value is not null)
            {
                dynamic incrementedValue = value;
                incrementedValue++;
                return incrementedValue;
            }
            throw new Exception($"Cannot convert nullish value {value}");
        }

    }

}

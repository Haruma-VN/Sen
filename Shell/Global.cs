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
            #pragma warning disable CS8600
            #pragma warning disable CS8603
            dynamic incrementedValue = value;
            incrementedValue++;
            return incrementedValue;
        }

        public static IEnumerable<T> RemoveNullElements<T>(this IEnumerable<T> collections)
        {
            var list = new List<T>() { };
            foreach(var collection in collections)
            {
                if(collection is not null)
                {
                    list.Add(collection);
                }
            }
            return list;
        }

        public static void ForEach<T, U>(this IEnumerable<T> list, Action<T, int> action)
        {
            var index = 0;
            foreach (var item in list)
            {
                action(item, index++);
            }
            return;
        }

    }

}

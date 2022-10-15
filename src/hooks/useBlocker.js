import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext } from 'react-router-dom';

export default function useBlocker(blocker, when = true) {
  const { navigator } = useContext(UNSAFE_NavigationContext);

  useEffect(() => {
    if (!when) return;

    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}

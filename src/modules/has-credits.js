const hasCredits = (c, b) => harlan.server.call(
  "SELECT FROM 'ICHEQUES'.'IPAYTHEBILL'",
  harlan.call('loader::ajax', {
    dataType: 'json',
    success: (data) => {
      if (data) {
        harlan.call('credits::has', c, () => {
          b();
        });
      } else {
        b();
      }
    },
  }),
);

export default hasCredits;

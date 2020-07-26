const img_savers_func = (all_issues) => {
  var valid_issues = all_issues.filter(
    (issue) =>
      issue.issue_status === 'Open' ||
      issue.issue_status === 'Assigned' ||
      issue.issue_status === 'Resolved'
  );

  var img_savers = valid_issues.map((issue) => issue.created_by);
  var a = [],
    b = [],
    prev;

  img_savers.sort();
  for (var i = 0; i < img_savers.length; i++) {
    if (img_savers[i] !== prev) {
      a.push(img_savers[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = img_savers[i];
  }
  var b_copy = [...b];
  b_copy.sort(function (c, d) {
    return d - c;
  });
  var invalid_indexes = [];

  var result = [];
  for (var i = 0; i < b_copy.length; i++) {
    for (var j = 0; j < b.length; j++) {
      if (b[j] == b_copy[i] && invalid_indexes.indexOf(j) == -1) {
        invalid_indexes.push(j);
        result.push({
          name: a[j],
          count: b[j],
        });
      }
    }
  }

  return result;
};
export default img_savers_func;

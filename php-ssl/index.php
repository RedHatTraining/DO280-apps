<?php
  function get_system_load($coreCount = 2, $interval = 1) {
    $rs = sys_getloadavg();
    $interval = $interval >= 1 && 3 <= $interval ? $interval : 1;
    $load = $rs[$interval];
    return round(($load * 100) / $coreCount,2);
  }

  function get_connections() {
    if (function_exists('exec')) {
      $www_total_count = 0;
      @exec ('netstat -an | egrep \':80|:443\' | awk \'{print $5}\' | grep -v \':::\*\' |  grep -v \'0.0.0.0\'', $results);

      foreach ($results as $result) {
        $array = explode(':', $result);
        $www_total_count ++;
        if (preg_match('/^::/', $result)) {
          $ipaddr = $array[3];
        } else {
          $ipaddr = $array[0];
        }
        if (!in_array($ipaddr, $unique)) {
          $unique[] = $ipaddr;
          $www_unique_count ++;
        }
      }
      unset ($results);

      return count($unique);
    }
  }

  function get_memory_usage() {
    $free = shell_exec('free');
    $free = (string)trim($free);
    $free_arr = explode("\n", $free);
    $mem = explode(" ", $free_arr[1]);
    $mem = array_filter($mem);
    $mem = array_merge($mem);
    $memory_usage = $mem[2] / $mem[1] * 100;

    return $memory_usage;
  }
?>

<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <title>PHP Application</title>
  </head>
  <body>
    <h2><strong>About this application</strong></h2>
    <?php
      if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') { ?>
        <i class="fa fa-lock"/><span style="color: #339966;"><strong>
          <?php echo 'The application is currently served over TLS'; ?>
        </span></strong>
      <?php
      } else { ?>
        <i class="fa fa-exclamation-triangle"/><span style="color: #993300;"><strong>
          <?php echo 'The application is currently served over HTTP'; ?>
        </span></strong>
      <?php } ?>
    <ul>
      <li>
        <strong>Current system load:</strong> <?php echo get_system_load() ?>
      </li>
      <li>
        <strong>Number of connections:</strong> <?php echo get_connections() ?>
      </li>
      <li>
        <strong>Memory usage:</strong> <?php echo round(get_memory_usage()) .' Mb' ?>
      </li>
    </ul>
  </body>
</html>
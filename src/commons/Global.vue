<script>

  const errorCodeMap = new Map();

  errorCodeMap.set("30000", "error.message.30000");
  errorCodeMap.set("30001", "error.message.30001");
  errorCodeMap.set("30002", "error.message.30002");
  errorCodeMap.set("30003", "error.message.30003");
  errorCodeMap.set("30004", "error.message.30004");
  errorCodeMap.set("30005", "error.message.30005");
  errorCodeMap.set("30006", "error.message.30006");

  function getMessageKey(key) {
    return errorCodeMap.get(key);
  }

  export default {
    errorCodeMap,
    getMessageKey
  }
</script>

admin_basic="$1"
URL="$2"
collection=("Company" "Production" "Template" "Deployment" "Data" "Review" "Release" "WorkCenter" "TP_WC_rel" "Notify" "ProductOwner" "ReviewRecord" "UpdateRecord" "User")

while true
do
  STATUS=$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Basic ${admin_basic}" "${URL}/_db/_system/_api/version")
  if [ $STATUS -eq 200 ]; then
    echo "Database connect success!"
    response=$(curl -w "" -s -H 'accept: application/json' -H "Authorization: Basic ${admin_basic}" "${URL}/_db/_system/_api/database")
    break
  else
    echo "Got $STATUS : Database connect fail!"
  fi
  sleep 5
done

isExist=$(echo ${response} | grep \"TMS_test\")

if [ ! $isExist ]; then
  echo "TMS_test not exist. Initial TMS_test DB."
  curl -H "Authorization: Basic ${admin_basic}" -d '{"name": "TMS_test", "users": [{"active": true, "extra": {}, "passwd": "tms", "username": "tms"}]}' "${URL}/_db/_system/_api/database"

  for col in "${collection[@]}"
  do
    curl -H "Authorization: Basic dG1zOnRtcw==" -d "{\"name\": \"${col}\"}" "${URL}/_db/TMS_test/_api/collection"
    echo "Create Collection ${col}."
  done
fi
echo "Database TMS_test already exist."

# wait this process close
wait $!

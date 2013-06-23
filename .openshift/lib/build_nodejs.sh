#!/bin/bash
# This is a simple build script and will be executed on your CI system if
# available.  Otherwise it will execute while your application is stopped
# before the deploy step.  This script gets executed directly, so it
# could be python, php, ruby, etc.


#  Source utility functions.
source "$OPENSHIFT_REPO_DIR/.openshift/lib/utils"

#  Setup path to include the custom Node[.js] version.
_SHOW_SETUP_PATH_MESSAGES="true" setup_path_for_custom_node_version


#  So we we moved the package.json file out of the way in pre_build,
#  so that the OpenShift git post-receive hook doesn't try and use the
#  old npm version to install the dependencies. Move it back in.
tmp_package_json="$(get_node_tmp_dir)/package.json"
if [ -f "$tmp_package_json" ]; then
   #  Only overlay it if there is no current package.json file.
   [ -f "${OPENSHIFT_REPO_DIR}/package.json" ]  ||    \
      mv "$tmp_package_json" "${OPENSHIFT_REPO_DIR}/package.json"
fi


#  Do npm install with the new npm binary.
if [ -f "${OPENSHIFT_REPO_DIR}"/package.json ]; then
   echo "  - Installing dependencies w/ new version of npm ... "
   echo
   (cd "${OPENSHIFT_REPO_DIR}"; export TMPDIR="/tmp"; npm install -d)
fi

